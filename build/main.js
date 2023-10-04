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
const axios = require("axios");
const crypto = require("crypto");
const mqtt = require("mqtt");
const fs = require("fs");
const API_BASE_URL = "https://www.soliscloud.com:13333";
const API_STATION = "/v1/api/userStationList";
class Solis extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "solis"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    let apiKey = this.config.apiKey;
    let apiSecret = this.config.apiSecret;
    let stationId = this.config.stationId;
    let callResult = await this.getStationDetails(stationId, apiKey, apiSecret);
    this.log.info("If this works, the consumption should be: " + (callResult == null ? void 0 : callResult.current_consumption));
    await this.setObjectNotExistsAsync("currentConsumption", {
      type: "state",
      common: {
        name: "currentConsumption",
        type: "boolean",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    this.subscribeStates("testVariable");
  }
  onUnload(callback) {
    try {
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
      const response = await axios({
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
      const result = {
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
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  HmacSHA1Encrypt(encryptText, keySecret) {
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
      "Dec"
    ];
    const formattedDate = `${days[cd.getUTCDay()]}, ${cd.getUTCDate()} ${months[cd.getUTCMonth()]} ${cd.getUTCFullYear()} ${cd.getUTCHours()}:${cd.getUTCMinutes()}:${cd.getUTCSeconds()} GMT`;
    return formattedDate;
  }
  getDigest(test) {
    const md5 = crypto.createHash("md5");
    md5.update(test);
    return md5.digest("base64");
  }
}
if (require.main !== module) {
  module.exports = (options) => new Solis(options);
} else {
  (() => new Solis())();
}
//# sourceMappingURL=main.js.map
