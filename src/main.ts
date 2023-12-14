import * as utils from "@iobroker/adapter-core";
import { getInverterDetails, getInverterList, getStationDetails } from "./lib/apiHelper";

class soliscloud extends utils.Adapter {
	private intervalId: any;
	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "soliscloud",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	//station details
	private async onReady(): Promise<void> {
		this.log.info("Starting soliscloud adapter");

		if (this.config.plantId != null) {
			this.config.plantId = this.name2id(this.config.plantId);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.current_consumption`,
				{
					type: "state",
					common: {
						name: "current_consumption",
						type: "number",
						unit: "kW",
						role: "value.power.consumed",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.current_power`,
				{
					type: "state",
					common: {
						name: "current_power",
						type: "number",
						unit: "kW",
						role: "value.power.produced",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.current_from_net`,
				{
					type: "state",
					common: {
						name: "current_from_net",
						type: "number",
						unit: "kW",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(`${this.config.plantId}.station_detail.sold_today`, {
				type: "state",
				common: {
					name: "sold_today",
					type: "number",
					unit: "kWh",
					role: "value.energy",
					read: true,
					write: false,
				},
				native: {},
			},);
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.generated_today`,
				{
					type: "state",
					common: {
						name: "generated_today",
						type: "number",
						unit: "kWh",
						role: "value.energy",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.bought_today`,
				{
					type: "state",
					common: {
						name: "bought_today",
						type: "number",
						unit: "kWh",
						role: "value.energy",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.consumption_today`,
				{
					type: "state",
					common: {
						name: "consumption_today",
						type: "number",
						unit: "kWh",
						role: "value.energy",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.battery_percent`,
				{
					type: "state",
					common: {
						name: "battery_percent",
						type: "number",
						role: "value.battery",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.battery_current_usage`,
				{
					type: "state",
					common: {
						name: "battery_current_usage",
						type: "number",
						unit: "kW",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.total_consumption_energy`,
				{
					type: "state",
					common: {
						name: "total_consumption_energy",
						type: "number",
						unit: "kWh",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.self_consumption_energy`,
				{
					type: "state",
					common: {
						name: "self_consumption_energy",
						type: "number",
						unit: "W",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.plant_state`,
				{
					type: "state",
					common: {
						name: "plant_state",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.battery_month_charge_energy`,
				{
					type: "state",
					common: {
						name: "battery_month_charge_energy",
						type: "number",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.battery_month_charge_energy_units`,
				{
					type: "state",
					common: {
						name: "battery_month_charge_energy_units",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.battery_year_charge_energy`,
				{
					type: "state",
					common: {
						name: "battery_year_charge_energy",
						type: "number",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.battery_year_charge_energy_units`,
				{
					type: "state",
					common: {
						name: "battery_year_charge_energy_units",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.battery_month_discharge_energy`,
				{
					type: "state",
					common: {
						name: "battery_month_discharge_energy",
						type: "number",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.battery_month_discharge_energy_units`,
				{
					type: "state",
					common: {
						name: "battery_month_discharge_units",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.battery_year_discharge_energy`,
				{
					type: "state",
					common: {
						name: "battery_year_discharge",
						type: "number",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.station_detail.battery_year_discharge_energy_units`,
				{
					type: "state",
					common: {
						name: "battery_year_discharge_units",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			//Inverter list
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.energy_day`,
				{
					type: "state",
					common: {
						name: "energy_day",
						type: "number",
						role: "value.power",
						unit: "kWh",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.state`,
				{
					type: "state",
					common: {
						name: "inverter_state",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			//inverter details
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.ac_current_R`,
				{
					type: "state",
					common: {
						name: "ac_current_R",
						type: "number",
						role: "value.current",
						unit: "A",
						read: true,
						write: false,
					},
					native: {},
				},
			);
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.ac_current_S`,
				{
					type: "state",
					common: {
						name: "ac_current_S",
						type: "number",
						role: "value.current",
						unit: "A",
						read: true,
						write: false,
					},
					native: {},
				},
			);
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.ac_current_T`,
				{
					type: "state",
					common: {
						name: "ac_current_T",
						type: "number",
						role: "value.current",
						unit: "A",
						read: true,
						write: false,
					},
					native: {},
				},
			);
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.ac_voltage_R`,
				{
					type: "state",
					common: {
						name: "ac_voltage_R",
						type: "number",
						role: "value.voltage",
						unit: "V",
						read: true,
						write: false,
					},
					native: {},
				},
			);
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.ac_voltage_S`,
				{
					type: "state",
					common: {
						name: "ac_voltage_S",
						type: "number",
						role: "value.voltage",
						unit: "V",
						read: true,
						write: false,
					},
					native: {},
				},
			);
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.ac_voltage_T`,
				{
					type: "state",
					common: {
						name: "ac_voltage_T",
						type: "number",
						role: "value.voltage",
						unit: "V",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.id`,
				{
					type: "state",
					common: {
						name: "id",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.serial_number`,
				{
					type: "state",
					common: {
						name: "serial_number",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.family_load_power_units`,
				{
					type: "state",
					common: {
						name: "family_load_power_units",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.family_load_power`,
				{
					type: "state",
					common: {
						name: "family_load_power",
						type: "number",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.temperature`,
				{
					type: "state",
					common: {
						name: "temperature",
						type: "number",
						role: "value.temperature",
						unit: "°C",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.battery_today_charge_energy`,
				{
					type: "state",
					common: {
						name: "battery_today_charge_energy",
						type: "number",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.battery_today_charge_energy_units`,
				{
					type: "state",
					common: {
						name: "battery_today_charge_energy_units",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.battery_total_charge_energy`,
				{
					type: "state",
					common: {
						name: "battery_total_charge_energy",
						type: "number",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.battery_total_charge_energy_units`,
				{
					type: "state",
					common: {
						name: "battery_total_charge_energy_units",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.battery_today_discharge_energy`,
				{
					type: "state",
					common: {
						name: "battery_today_discharge_energy_units",
						type: "number",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.battery_today_discharge_energy_units`,
				{
					type: "state",
					common: {
						name: "battery_today_discharge_energy_units",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.battery_total_discharge_energy`,
				{
					type: "state",
					common: {
						name: "battery_total_discharge",
						type: "number",
						role: "value.power",
						read: true,
						write: false,
					},
					native: {},
				},
			);
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.inverter_detail.battery_total_discharge_energy_units`,
				{
					type: "state",
					common: {
						name: "battery_total_discharge_units",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				},
			);

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
				this.config.plantId,
				this.config.apiKey,
				this.config.apiSecret,
				this.log
			);

			if (callResult) {
				this.log.debug("Received result from API call, current consumption should be: " + callResult.current_consumption);
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
						this.log.error(`Received an incorrect plant status from the API Call, this should NOT happen.`)
						break;
				}
				this.log.debug(`Plant ${this.config.plantId} is ${plantStatus}`);
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
			} else {
				this.log.debug("Did not receive a correct response from the Stationdetails API call");
			}
		} catch (e) {
			this.log.error(`Error while calling API (Station): ${e} `)
		}

		try {
			const inverterDetailResult = await getInverterList(
				this.config.plantId,
				this.config.apiKey,
				this.config.apiSecret,
				this.log
			);
			this.log.debug(`Correct result from Inverter API call, inverter state: ${inverterDetailResult.inverter_state}`)
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
					this.log.error(`Received an incorrect plant status from the inverter API Call, this should NOT happen.`)
					break;
			}
			this.log.debug(`set inverter state to: ${inverterStatus}`)
			if (inverterDetailResult) {
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
			this.log.error(`error while calling API (Inverter): ${e}`)
		}

		try {
			this.getState(`${this.config.plantId}.inverter_detail.id`, async (err, state) => {
				if (!err && state && state.val) {
					const inverterId = state.val.toString();
					this.log.debug(`The value of ${this.config.plantId}.inverter_detail.id is ${inverterId}`);
					const inverterDetails = await getInverterDetails(inverterId, this.config.apiKey, this.config.apiSecret, this.log);
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
			this.log.error("Error calling inverterDetails")
		}

		if (this.config.epl) {
			this.log.info('EPL is enabled, making API call');
		}

	}

	private onUnload(callback: () => void): void {
		try {
			this.log.info("Stopping soliscloud polling");
			this.clearInterval(this.intervalId);
			callback();
		} catch (e) {
			this.log.info("Error while stopping polling: " + e);
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
