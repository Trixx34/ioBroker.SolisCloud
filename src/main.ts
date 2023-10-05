import * as utils from "@iobroker/adapter-core";

import axios from "axios";
import crypto from "crypto";

const API_BASE_URL = "https://www.soliscloud.com:13333";
class SolisCloud extends utils.Adapter {
	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "soliscloud",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {

			await this.setObjectNotExistsAsync("current_Consumption", {
				type: "state",
				common: {
					name: "currentConsumption",
					type: "number",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync("current_Power", {
				type: "state",
				common: {
					name: "current_Power",
					type: "number",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync("current_From_Net", {
				type: "state",
				common: {
					name: "current_From_Net",
					type: "number",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync("sold_Today", {
				type: "state",
				common: {
					name: "sold_Today",
					type: "number",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync("generated_Today", {
				type: "state",
				common: {
					name: "generated_Today",
					type: "number",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync("bought_Today", {
				type: "state",
				common: {
					name: "bought_Today",
					type: "number",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync("consumption_Today", {
				type: "state",
				common: {
					name: "consumption_Today",
					type: "number",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync("battery_percent", {
				type: "state",
				common: {
					name: "battery_percent",
					type: "number",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync("battery_current_usage", {
				type: "state",
				common: {
					name: "battery_current_usage",
					type: "number",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			});

		const callResult = await this.getStationDetails(this.config.plantId, this.config.apiKey, this.config.apiSecret);
		this.subscribeStates("current_Consumption");
		this.subscribeStates("current_Power");
		this.subscribeStates("current_From_Net");
		this.subscribeStates("sold_Today");
		this.subscribeStates("generated_Today");
		this.subscribeStates("bought_Today");
		this.subscribeStates("consumption_Today");
		this.subscribeStates("battery_percent");
		this.subscribeStates("battery_current_usage");


		if (this.config.apiKey && this.config.apiSecret && this.config.plantId) {
			await this.setStateAsync("current_Consumption", callResult?.current_consumption);
			await this.setStateAsync("current_Power", callResult?.current_Power);
			await this.setStateAsync("current_From_Net", callResult?.current_From_Net);
			await this.setStateAsync("sold_Today", callResult?.sold_Today);
			await this.setStateAsync("generated_Today", callResult?.generated_Today);
			await this.setStateAsync("bought_Today", callResult?.bought_Today);
			await this.setStateAsync("consumption_Today", callResult?.consumption_Today);
			await this.setStateAsync("battery_percent", callResult?.battery_percent);
			await this.setStateAsync("battery_current_usage", callResult?.battery_current_usage);

		}
	}
	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Is called if a subscribed state changes
	 */
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	private async getStationDetails(stationId: string, apiKey: string, apiSecret: string) {
		const map = {
			id: stationId,
		};
		const body = JSON.stringify(map);
		const ContentMd5 = this.getDigest(body);
		const currentDate = this.getGMTTime();
		const param =
			"POST" +
			"\n" +
			ContentMd5 +
			"\n" +
			"application/json" +
			"\n" +
			currentDate +
			"\n" +
			"/v1/api/stationDetail";
		const sign = this.HmacSHA1Encrypt(param, apiSecret);
		const url = API_BASE_URL + "/v1/api/stationDetail";
		try {
			const requestBody = JSON.stringify(map);
			const response = await axios({
				method: "post",
				url: url,
				headers: {
					"Content-type": "application/json;charset=UTF-8",
					Authorization: `API ${apiKey}:${sign}`,
					"Content-MD5": ContentMd5,
					Date: currentDate,
				},
				data: requestBody,
			});
			//console.log(response.data.data);
			return {
				current_Power: response.data.data.power,
				current_consumption: response.data.data.familyLoadPower,
				current_From_Net: response.data.data.psum,
				sold_Today: response.data.data.gridSellDayEnergy,
				generated_Today: response.data.data.dayEnergy,
				bought_Today: response.data.data.gridPurchasedDayEnergy,
				consumption_Today: response.data.data.homeLoadEnergy,
				battery_percent: response.data.data.batteryPercent,
				battery_current_usage: response.data.data.batteryPower,
			};
		} catch (error) {
			console.error(error);
		}
	}

	private HmacSHA1Encrypt(encryptText: string, keySecret: string):string {
		const keyBuffer = Buffer.from(keySecret, "utf-8");
		const hmac = crypto.createHmac("sha1", keyBuffer);
		hmac.update(encryptText, "utf-8");
		const resultBuffer = hmac.digest();
		return resultBuffer.toString("base64");
	}

	private getGMTTime():string {
		const cd = new Date();
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		return `${days[cd.getUTCDay()]}, ${cd.getUTCDate()} ${months[cd.getUTCMonth()]} ${cd.getUTCFullYear()} ${cd.getUTCHours()}:${cd.getUTCMinutes()}:${cd.getUTCSeconds()} GMT`;
	}

	private getDigest(test:string):string {
		const md5 = crypto.createHash("md5");
		md5.update(test);
		return md5.digest("base64");
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new SolisCloud(options);
} else {
	// otherwise start the instance directly
	(() => new SolisCloud())();
}