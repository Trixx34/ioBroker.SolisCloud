import * as utils from "@iobroker/adapter-core";
const axios = require("axios");
const crypto = require("crypto");
const mqtt = require("mqtt");
const fs = require("fs");
const API_BASE_URL = "https://www.soliscloud.com:13333";
const API_STATION = "/v1/api/userStationList";

class Solis extends utils.Adapter {

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "solis",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	private async onReady(): Promise<void> {
		let apiKey = this.config.apiKey;
		let apiSecret = this.config.apiSecret;
		let stationId = this.config.stationId;

		let callResult = await this.getStationDetails(stationId, apiKey, apiSecret);
		this.log.info("If this works, the consumption should be: " + callResult?.current_consumption);

		await this.setObjectNotExistsAsync("currentConsumption", {
			type: "state",
			common: {
				name: "currentConsumption",
				type: "boolean",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});

		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		this.subscribeStates("testVariable");
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates("lights.*");
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates("*");

		/*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)
		// await this.setStateAsync("testVariable", true);

		// // same thing, but the value is flagged "ack"
		// // ack should be always set to true if the value is received from or acknowledged from the target system
		// await this.setStateAsync("testVariable", { val: true, ack: true });

		// // same thing, but the state is deleted after 30s (getState will return null afterwards)
		// await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

		// examples for the checkPassword/checkGroup functions
		// let result = await this.checkPasswordAsync("admin", "iobroker");
		// this.log.info("check user admin pw iobroker: " + result);

		// result = await this.checkGroupAsync("admin", "admin");
		// this.log.info("check group user admin group admin: " + result);
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


	//Solis functions
	async getStationDetails(stationId: string, apiKey: string, apiSecret: string) {
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
			//    console.log(response.data.data);
			const result = {
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

		const formattedDate = `${days[cd.getUTCDay()]}, ${cd.getUTCDate()} ${months[cd.getUTCMonth()]
			} ${cd.getUTCFullYear()} ${cd.getUTCHours()}:${cd.getUTCMinutes()}:${cd.getUTCSeconds()} GMT`;

		return formattedDate;
	}

	getDigest(test: string) {
		const md5 = crypto.createHash("md5");
		md5.update(test);
		return md5.digest("base64");
	}

}

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Solis(options);
} else {
	// otherwise start the instance directly
	(() => new Solis())();
}