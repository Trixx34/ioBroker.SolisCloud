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
var import_apiHelper = require("./lib/apiHelper");
var import_apiHelper2 = require("./lib/apiHelper");
class soliscloud extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "soliscloud"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    this.log.info("Starting soliscloud adapter");
    this.validatePlantID(this.config.plantId);
    if (this.config.plantId != null && this.validatePlantID(this.config.plantId)) {
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
            write: true
          },
          native: {}
        }
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
            write: true
          },
          native: {}
        }
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
            write: true
          },
          native: {}
        }
      );
      await this.setObjectNotExistsAsync(`${this.config.plantId}.sold_today`, {
        type: "state",
        common: {
          name: "sold_today",
          type: "number",
          unit: "kWh",
          role: "value.energy",
          read: true,
          write: true
        },
        native: {}
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
            write: true
          },
          native: {}
        }
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
            write: true
          },
          native: {}
        }
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
            write: true
          },
          native: {}
        }
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
            write: true
          },
          native: {}
        }
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
            write: true
          },
          native: {}
        }
      );
    } else {
      this.log.error("No plantID was entered or it contains invalid characters.");
    }
    if (this.config.apiKey && this.config.apiSecret && this.config.plantId) {
      this.log.info(
        `Start polling soliscloud, polling every ${this.config.pollInterval} seconds`
      );
      this.intervalId = this.setInterval(async () => {
        await this.pollSolis();
      }, this.config.pollInterval * 1e3);
    } else {
      this.log.error("No plantID was entered or it contains invalid characters. NOT polling.");
    }
  }
  validatePlantID(plantId) {
    const pattern = /^[a-zA-Z0-9]*$/;
    return pattern.test(plantId);
  }
  async pollSolis() {
    const callResult = await (0, import_apiHelper.getStationDetails)(
      this.config.plantId,
      this.config.apiKey,
      this.config.apiSecret
    );
    if (callResult) {
      this.log.debug("Received result from API call, current consumption should be: " + callResult.current_consumption);
      await this.setStateAsync(
        `${this.config.plantId}.current_consumption`,
        callResult.current_consumption
      );
      await this.setStateAsync(
        `${this.config.plantId}.current_power`,
        callResult.current_power
      );
      await this.setStateAsync(
        `${this.config.plantId}.current_from_net`,
        callResult.current_from_net
      );
      await this.setStateAsync(
        `${this.config.plantId}.sold_today`,
        callResult.sold_today
      );
      await this.setStateAsync(
        `${this.config.plantId}.generated_today`,
        callResult.generated_today
      );
      await this.setStateAsync(
        `${this.config.plantId}.bought_today`,
        callResult.bought_today
      );
      await this.setStateAsync(
        `${this.config.plantId}.consumption_today`,
        callResult.consumption_today
      );
      await this.setStateAsync(
        `${this.config.plantId}.battery_percent`,
        callResult.battery_percent
      );
      await this.setStateAsync(
        `${this.config.plantId}.battery_current_usage`,
        callResult.battery_current_usage
      );
    } else {
      this.log.debug("Did not receive a correct response from the API call");
    }
  }
  onUnload(callback) {
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
  module.exports = (options) => new soliscloud(options);
} else {
  (() => new soliscloud())();
}
//# sourceMappingURL=main.js.map
