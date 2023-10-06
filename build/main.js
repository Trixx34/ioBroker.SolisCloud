"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_axios = __toESM(require("axios"));
var import_crypto = __toESM(require("crypto"));
const API_BASE_URL = "https://www.soliscloud.com:13333";
class SolisCloud extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "soliscloud"
    });
    this.running = false;
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    await this.setObjectNotExistsAsync("current_Consumption", {
      type: "state",
      common: {
        name: "currentConsumption",
        type: "number",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("current_Power", {
      type: "state",
      common: {
        name: "current_Power",
        type: "number",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("current_From_Net", {
      type: "state",
      common: {
        name: "current_From_Net",
        type: "number",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("sold_Today", {
      type: "state",
      common: {
        name: "sold_Today",
        type: "number",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("generated_Today", {
      type: "state",
      common: {
        name: "generated_Today",
        type: "number",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("bought_Today", {
      type: "state",
      common: {
        name: "bought_Today",
        type: "number",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("consumption_Today", {
      type: "state",
      common: {
        name: "consumption_Today",
        type: "number",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("battery_percent", {
      type: "state",
      common: {
        name: "battery_percent",
        type: "number",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    await this.setObjectNotExistsAsync("battery_current_usage", {
      type: "state",
      common: {
        name: "battery_current_usage",
        type: "number",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    if (this.config.apiKey && this.config.apiSecret && this.config.plantId) {
      this.running = true;
      while (this.running) {
        const callResult = await this.getStationDetails(this.config.plantId, this.config.apiKey, this.config.apiSecret);
        await this.setStateAsync("current_Consumption", callResult == null ? void 0 : callResult.current_consumption);
        await this.setStateAsync("current_Power", callResult == null ? void 0 : callResult.current_Power);
        await this.setStateAsync("current_From_Net", callResult == null ? void 0 : callResult.current_From_Net);
        await this.setStateAsync("sold_Today", callResult == null ? void 0 : callResult.sold_Today);
        await this.setStateAsync("generated_Today", callResult == null ? void 0 : callResult.generated_Today);
        await this.setStateAsync("bought_Today", callResult == null ? void 0 : callResult.bought_Today);
        await this.setStateAsync("consumption_Today", callResult == null ? void 0 : callResult.consumption_Today);
        await this.setStateAsync("battery_percent", callResult == null ? void 0 : callResult.battery_percent);
        await this.setStateAsync("battery_current_usage", callResult == null ? void 0 : callResult.battery_current_usage);
        await new Promise((resolve) => setTimeout(resolve, 3e4));
      }
    }
  }
  onUnload(callback) {
    try {
      this.running = false;
      callback();
    } catch (e) {
      callback();
    }
  }
  onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
  async getStationDetails(stationId, apiKey, apiSecret) {
    const map = {
      id: stationId
    };
    const body = JSON.stringify(map);
    const ContentMd5 = this.getDigest(body);
    const currentDate = this.getGMTTime();
    const param = "POST\n" + ContentMd5 + "\napplication/json\n" + currentDate + "\n/v1/api/stationDetail";
    const sign = this.HmacSHA1Encrypt(param, apiSecret);
    const url = API_BASE_URL + "/v1/api/stationDetail";
    try {
      const requestBody = JSON.stringify(map);
      const response = await (0, import_axios.default)({
        method: "post",
        url,
        headers: {
          "Content-type": "application/json;charset=UTF-8",
          Authorization: `API ${apiKey}:${sign}`,
          "Content-MD5": ContentMd5,
          Date: currentDate
        },
        data: requestBody
      });
      return {
        current_Power: response.data.data.power,
        current_consumption: response.data.data.familyLoadPower,
        current_From_Net: response.data.data.psum,
        sold_Today: response.data.data.gridSellDayEnergy,
        generated_Today: response.data.data.dayEnergy,
        bought_Today: response.data.data.gridPurchasedDayEnergy,
        consumption_Today: response.data.data.homeLoadEnergy,
        battery_percent: response.data.data.batteryPercent,
        battery_current_usage: response.data.data.batteryPower
      };
    } catch (error) {
      console.error(error);
    }
  }
  HmacSHA1Encrypt(encryptText, keySecret) {
    const keyBuffer = Buffer.from(keySecret, "utf-8");
    const hmac = import_crypto.default.createHmac("sha1", keyBuffer);
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
      "Dec"
    ];
    return `${days[cd.getUTCDay()]}, ${cd.getUTCDate()} ${months[cd.getUTCMonth()]} ${cd.getUTCFullYear()} ${cd.getUTCHours()}:${cd.getUTCMinutes()}:${cd.getUTCSeconds()} GMT`;
  }
  getDigest(test) {
    const md5 = import_crypto.default.createHash("md5");
    md5.update(test);
    return md5.digest("base64");
  }
}
if (require.main !== module) {
  module.exports = (options) => new SolisCloud(options);
} else {
  (() => new SolisCloud())();
}
//# sourceMappingURL=main.js.map
