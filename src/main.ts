import * as utils from "@iobroker/adapter-core";
const axios = require("axios");
const crypto = require("crypto");
const API_BASE_URL = "https://www.soliscloud.com:13333";

class Solis extends utils.Adapter {

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "solis",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	private async onReady(): Promise<void> {
		const apiKey = this.config.apiKey;
		const apiSecret = this.config.apiSecret;
		const stationId = this.config.stationId;

		const callResult: SolisData | undefined = await this.getStationDetails(stationId, apiKey, apiSecret);

		await this.setObjectNotExistsAsync("currentConsumption", {
			type: "state",
			common: {
				name: "currentConsumption",
				type: "string",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});

		this.subscribeStates("currentConsumption");
		if (callResult) {
			await this.setStateAsync("currentConsumption", callResult.solis_current_consumption);
			this.log.info(callResult?.solis_battery_current_usage.toString());
		}

	}

	private onUnload(callback: () => void): void {
		try {
			callback();
		} catch (e) {
			callback();
		}
	}

	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (state) {
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			this.log.info(`state ${id} deleted`);
		}
	}

	async getStationDetails(stationId: string, apiKey: string, apiSecret: string): Promise<SolisData | undefined> {
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

			const result = {
				solis_current_Power: response.data.data.power,
				solis_current_consumption: response.data.data.familyLoadPower,
				solis_current_From_Net: response.data.data.psum,
				solis_sold_Today: response.data.data.gridSellDayEnergy,
				solis_generated_Today: response.data.data.dayEnergy,
				solis_bought_Today: response.data.data.gridPurchasedDayEnergy,
				solis_consumption_Today: response.data.data.homeLoadEnergy,
				solis_battery_percent: response.data.data.batteryPercent,
				solis_battery_current_usage: response.data.data.batteryPower,
			};
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	HmacSHA1Encrypt(encryptText: string, keySecret: string) {
		const keyBuffer = Buffer.from(keySecret, "utf-8");
		const hmac = crypto.createHmac("sha1", keyBuffer);
		hmac.update(encryptText, "utf-8");
		const resultBuffer = hmac.digest();
		return resultBuffer.toString("base64");
	}

	getGMTTime() {
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

		const formattedDate = `${days[cd.getUTCDay()]}, ${cd.getUTCDate()} ${months[cd.getUTCMonth()]} ${cd.getUTCFullYear()} ${cd.getUTCHours()}:${cd.getUTCMinutes()}:${cd.getUTCSeconds()} GMT`;

		return formattedDate;
	}

	getDigest(test: string) {
		const md5 = crypto.createHash("md5");
		md5.update(test);
		return md5.digest("base64");
	}

}

if (require.main !== module) {
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Solis(options);
} else {
	(() => new Solis())();
}

type SolisData = {
	solis_current_Power: number;
	solis_current_consumption: number;
	solis_current_From_Net: number;
	solis_sold_Today: number;
	solis_generated_Today: number;
	solis_bought_Today: number;
	solis_consumption_Today: number;
	solis_battery_percent: number;
	solis_battery_current_usage: number;
	[key: string]: number; // Index signature allowing any string key
};
