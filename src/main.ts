import * as utils from "@iobroker/adapter-core";
import { getStationDetails } from "./lib/apiHelper";
import "./lib/apiHelper";

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

	private async onReady(): Promise<void> {
		this.log.info("Starting soliscloud adapter");
		if (this.config.plantId != null) {
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.current_consumption`,
				{
					type: "state",
					common: {
						name: "current_consumption",
						type: "number",
						unit: "kW",
						role: "value.power.consumed",
						read: true,
						write: true,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.current_power`,
				{
					type: "state",
					common: {
						name: "current_power",
						type: "number",
						unit: "kW",
						role: "value.power.produced",
						read: true,
						write: true,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.current_from_net`,
				{
					type: "state",
					common: {
						name: "current_from_net",
						type: "number",
						unit: "kW",
						role: "value.power",
						read: true,
						write: true,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(`${this.config.plantId}.sold_today`, {
				type: "state",
				common: {
					name: "sold_today",
					type: "number",
					unit: "kWh",
					role: "value.energy",
					read: true,
					write: true,
				},
				native: {},
			});
			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.generated_today`,
				{
					type: "state",
					common: {
						name: "generated_today",
						type: "number",
						unit: "kWh",
						role: "value.energy",
						read: true,
						write: true,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.bought_today`,
				{
					type: "state",
					common: {
						name: "bought_today",
						type: "number",
						unit: "kWh",
						role: "value.energy",
						read: true,
						write: true,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.consumption_today`,
				{
					type: "state",
					common: {
						name: "consumption_today",
						type: "number",
						unit: "kWh",
						role: "value.energy",
						read: true,
						write: true,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.battery_percent`,
				{
					type: "state",
					common: {
						name: "battery_percent",
						type: "number",
						unit: "%",
						role: "value.fill",
						read: true,
						write: true,
					},
					native: {},
				},
			);

			await this.setObjectNotExistsAsync(
				`${this.config.plantId}.battery_current_usage`,
				{
					type: "state",
					common: {
						name: "battery_current_usage",
						type: "number",
						unit: "kW",
						role: "value.power",
						read: true,
						write: true,
					},
					native: {},
				},
			);
		} else {
			this.log.error("No plantID was entered or it contains invalid characters.");
		}

		if (this.config.apiKey && this.config.apiSecret && this.config.plantId) {
			this.log.info(
				`Start polling soliscloud, polling every ${this.config.pollInterval} seconds`,
			);
			this.intervalId = this.setInterval(async () => {
				await this.pollSolis();
			}, this.config.pollInterval * 1000);
		} else {
			this.log.error("No plantID was entered or it contains invalid characters. NOT polling.");
		}
	}

	private async pollSolis(): Promise<void> {
		const callResult = await getStationDetails(
			this.config.plantId,
			this.config.apiKey,
			this.config.apiSecret,
		);
		if (callResult) {
			this.log.debug("Received result from API call, current consumption should be: " + callResult.current_consumption);
			await this.setStateAsync(
				`${this.config.plantId}.current_consumption`,
				callResult.current_consumption,
			);
			await this.setStateAsync(
				`${this.config.plantId}.current_power`,
				callResult.current_power,
			);
			await this.setStateAsync(
				`${this.config.plantId}.current_from_net`,
				callResult.current_from_net,
			);
			await this.setStateAsync(
				`${this.config.plantId}.sold_today`,
				callResult.sold_today,
			);
			await this.setStateAsync(
				`${this.config.plantId}.generated_today`,
				callResult.generated_today,
			);
			await this.setStateAsync(
				`${this.config.plantId}.bought_today`,
				callResult.bought_today,
			);
			await this.setStateAsync(
				`${this.config.plantId}.consumption_today`,
				callResult.consumption_today,
			);
			await this.setStateAsync(
				`${this.config.plantId}.battery_percent`,
				callResult.battery_percent,
			);
			await this.setStateAsync(
				`${this.config.plantId}.battery_current_usage`,
				callResult.battery_current_usage,
			);
		} else {
			this.log.debug("Did not receive a correct response from the API call");
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
