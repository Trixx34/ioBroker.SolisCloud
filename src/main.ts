import * as utils from "@iobroker/adapter-core";
import { getEpmDetails, getInverterDetails, getInverterList, getStationDetails } from "./lib/apiHelper";
import { createObjects } from "./lib/createObjects";

class soliscloud extends utils.Adapter {
	private intervalId: any;
	private sentryInstance: any = this.getSentryInstance();
	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "soliscloud",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	private async onReady(): Promise<void> {
		this.log.info("Starting soliscloud adapter");
		this.log.info(`Debuglogging is ${this.config.debugLogging}`);
		if (this.config.plantId != null) {
			this.config.plantId = this.name2id(this.config.plantId);
			createObjects(this);
		} else {
			this.log.error("No plantID was entered or it contains invalid characters.");
		}

		if (this.configOK()) {
			this.log.info(
				`Start polling soliscloud, polling every ${this.config.pollInterval} seconds`,
			);
			this.intervalId = this.setInterval(async () => {
				await this.pollSolis();
			}, this.config.pollInterval * 1000);
		} else {
			this.log.error("Config seems to be invalid, NOT polling.");
		}
	}

	private name2id(pName: string): string {
		return (pName || "").replace(this.FORBIDDEN_CHARS, "_");
	}

	private configOK(): boolean {
		if (
			this.config.apiKey &&
			this.config.plantId &&
			typeof this.config.pollInterval === "number" &&
			this.config.pollInterval >= 45 &&
			this.config.pollInterval <= 1800
		) {
			return true;
		}
		return false;
	}

	private async pollSolis(): Promise<void> {
		try {
			const callResult = await getStationDetails(
				this
			);
			if (this.config.debugLogging) {
				this.log.debug("getStationDetails callResult" + JSON.stringify(callResult));
			}
			if (callResult) {
				if (this.config.debugLogging) {
					this.log.debug("Received result from API call, current consumption should be: " + callResult.current_consumption);
				}
				let plantStatus = "";
				switch (callResult.plant_state) {
					case 1:
						plantStatus = "Online";
						break;
					case 2:
						plantStatus = "Offline";
						break;
					case 3:
						plantStatus = "Alarm";
						break;
					default:
						this.log.error(`Received an incorrect plant status from the API Call, this should NOT happen.`);
						if (this.sentryInstance) {
							this.sentryInstance.getSentryObject().captureException(callResult.plant_state);
						}
						break;
				}
				if (this.config.debugLogging) {
					this.log.debug(`Plant ${this.config.plantId} is ${plantStatus}`);
				}
				await this.setStateAsync(
					`${this.config.plantId}.station_detail.plant_state`,
					{ val: plantStatus, ack: true }
				);

				const properties = [
					"current_consumption",
					"current_power",
					"current_from_net",
					"sold_today",
					"generated_today",
					"bought_today",
					"consumption_today",
					"battery_percent",
					"battery_current_usage",
					"total_consumption_energy",
					"self_consumption_energy",
					"battery_month_charge_energy",
					"battery_month_charge_energy_units",
					"battery_year_charge_energy",
					"battery_year_charge_energy_units",
					"battery_month_discharge_energy",
					"battery_month_discharge_energy_units",
					"battery_year_discharge_energy",
					"battery_year_discharge_energy_units",
				];
				for (const property of properties) {
					await this.setStateAsync(
						`${this.config.plantId}.station_detail.${property}`,
						{ val: callResult[property], ack: true }
					);
				}
			} else if (this.sentryInstance) {
				this.sentryInstance.getSentryObject().captureException(callResult);
			}
		} catch (e) {
			this.sentryInstance.getSentryObject().captureException(e);
		}
		try {
			const inverterDetailResult = await getInverterList(
				this
			);
			if (inverterDetailResult) {
				if (this.config.debugLogging) {
					this.log.debug(`Correct result from Inverter API call, inverter state: ${inverterDetailResult.inverter_state}`);
				}
				let inverterStatus = "";

				switch (inverterDetailResult.inverter_state) {
					case 1:
						inverterStatus = "Online";
						break;
					case 2:
						inverterStatus = "Offline";
						break;
					case 3:
						inverterStatus = "Alarm";
						break;
					default:
						this.log.error(`Received an incorrect plant status from the inverter API Call, this should NOT happen.`);
						break;
				}
				if (this.config.debugLogging) {
					this.log.debug(`set inverter state to: ${inverterStatus}`);
				}
				await this.setStateAsync(
					`${this.config.plantId}.inverter_detail.energy_day`,
					{ val: inverterDetailResult.etoday, ack: true },
				);
				await this.setStateAsync(
					`${this.config.plantId}.inverter_detail.state`,
					{ val: inverterStatus, ack: true },
				);
				await this.setStateAsync(
					`${this.config.plantId}.inverter_detail.id`,
					{ val: inverterDetailResult.inverter_id, ack: true },
				);
				await this.setStateAsync(
					`${this.config.plantId}.inverter_detail.serial_number`,
					{ val: inverterDetailResult.inverter_serial_number, ack: true },
				);
			}
		} catch (e) {
			this.log.error(`error while calling API (Inverter): ${e}`);
			if (this.sentryInstance) {
				this.sentryInstance.getSentryObject().captureException(e);
			}
		}

		try {
			this.getState(`${this.config.plantId}.inverter_detail.id`, async (err, state) => {
				if (!err && state && state.val) {
					const inverterId = state.val.toString();
					if (this.config.debugLogging) {
						this.log.debug(`The value of ${this.config.plantId}.inverter_detail.id is ${inverterId}`);
					}
					const inverterDetails = await getInverterDetails(this, inverterId);
					if (inverterDetails) {
						const propertiesToSet = [
							"ac_current_R",
							"ac_current_S",
							"ac_current_T",
							"ac_voltage_R",
							"ac_voltage_S",
							"ac_voltage_T",
							"family_load_power_units",
							"family_load_power",
							"temperature",
							"battery_today_charge_energy",
							"battery_today_charge_energy_units",
							"battery_total_charge_energy",
							"battery_total_charge_energy_units",
							"battery_today_discharge_energy",
							"battery_today_discharge_energy_units",
							"battery_total_discharge_energy",
							"battery_total_discharge_energy_units",
						];

						propertiesToSet.forEach(async (property) => {
							const stateKey = `${this.config.plantId}.inverter_detail.${property}`;
							await this.setStateAsync(stateKey, { val: inverterDetails[property], ack: true });
						});
					} else {
						this.log.error(`Error getting the state: ${err}`);
					}
				}
			});
		} catch (e) {
			this.sentryInstance.getSentryObject().captureException(e);
		}

		if (this.config.epm) {
			this.log.info("EPM is enabled, making API call");
			getEpmDetails(this);
		}
	}

	private getSentryInstance(): any {
		if (this.supportsFeature && this.supportsFeature("PLUGINS")) {
			return this.getPluginInstance("sentry");
		}
	}

	private onUnload(callback: () => void): void {
		try {
			this.log.info("Stopping soliscloud polling");
			this.clearInterval(this.intervalId);
			callback();
		} catch (e) {
			this.sentryInstance.getSentryObject().captureException(e);
			callback();
		}
	}
}

if (require.main !== module) {
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) =>
		new soliscloud(options);
} else {
	(() => new soliscloud())();
}
