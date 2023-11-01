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
    if (this.config.plantId != null) {
      this.config.plantId = this.name2id(this.config.plantId);
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
            write: false
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
            write: false
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
            write: false
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
          write: false
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
            write: false
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
            write: false
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
            write: false
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
            write: false
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
            write: false
          },
          native: {}
        }
      );
      await this.setObjectNotExistsAsync(
        `${this.config.plantId}.battery_today_charge`,
        {
          type: "state",
          common: {
            name: "battery_today_charge",
            type: "number",
            unit: "kWh",
            role: "value.power",
            read: true,
            write: false
          },
          native: {}
        }
      );
      await this.setObjectNotExistsAsync(
        `${this.config.plantId}.battery_today_discharge`,
        {
          type: "state",
          common: {
            name: "battery_today_discharge",
            type: "number",
            unit: "kWh",
            role: "value.power",
            read: true,
            write: false
          },
          native: {}
        }
      );
      await this.setObjectNotExistsAsync(
        `${this.config.plantId}.total_consumption_energy`,
        {
          type: "state",
          common: {
            name: "total_consumption_energy",
            type: "number",
            unit: "kWh",
            role: "value.power",
            read: true,
            write: false
          },
          native: {}
        }
      );
      await this.setObjectNotExistsAsync(
        `${this.config.plantId}.self_consumption_energy`,
        {
          type: "state",
          common: {
            name: "self_consumption_energy",
            type: "number",
            unit: "kWh",
            role: "value.power",
            read: true,
            write: false
          },
          native: {}
        }
      );
      await this.setObjectNotExistsAsync(
        `${this.config.plantId}.plant_state`,
        {
          type: "state",
          common: {
            name: "plant_state",
            type: "string",
            role: "text",
            read: true,
            write: false
          },
          native: {}
        }
      );
      await this.setObjectNotExistsAsync(
        `${this.config.plantId}.energy_day`,
        {
          type: "state",
          common: {
            name: "energy_day",
            type: "number",
            role: "value.power",
            unit: "kWh",
            read: true,
            write: false
          },
          native: {}
        }
      );
      await this.setObjectNotExistsAsync(
        `${this.config.plantId}.inverter_state`,
        {
          type: "state",
          common: {
            name: "inverter_state",
            type: "string",
            role: "text",
            read: true,
            write: false
          },
          native: {}
        }
      );
    } else {
      this.log.error("No plantID was entered or it contains invalid characters.");
    }
    if (this.configOK()) {
      this.log.info(
        `Start polling soliscloud, polling every ${this.config.pollInterval} seconds`
      );
      this.intervalId = this.setInterval(async () => {
        await this.pollSolis();
      }, this.config.pollInterval * 1e3);
    } else {
      this.log.error("Config seems to be invalid, NOT polling.");
    }
  }
  name2id(pName) {
    return (pName || "").replace(this.FORBIDDEN_CHARS, "_");
  }
  configOK() {
    if (this.config.apiKey && this.config.plantId && typeof this.config.pollInterval === "number" && this.config.pollInterval >= 45 && this.config.pollInterval <= 1800) {
      return true;
    }
    return false;
  }
  async pollSolis() {
    try {
      const callResult = await (0, import_apiHelper.getStationDetails)(
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
            this.log.error(`Received an incorrect plant status from the API Call, this should NOT happen.`);
            break;
        }
        this.log.debug(`Plant ${this.config.plantId} is ${plantStatus}`);
        await this.setStateAsync(
          `${this.config.plantId}.current_consumption`,
          { val: callResult.current_consumption, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.current_power`,
          { val: callResult.current_power, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.current_from_net`,
          { val: callResult.current_from_net, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.sold_today`,
          { val: callResult.sold_today, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.generated_today`,
          { val: callResult.generated_today, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.bought_today`,
          { val: callResult.bought_today, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.consumption_today`,
          { val: callResult.consumption_today, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.battery_percent`,
          { val: callResult.battery_percent, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.battery_current_usage`,
          { val: callResult.battery_current_usage, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.battery_today_charge`,
          { val: callResult.battery_today_charge, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.battery_today_discharge`,
          { val: callResult.battery_today_discharge, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.total_consumption_energy`,
          { val: callResult.total_consumption_energy, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.self_consumption_energy`,
          { val: callResult.self_consumption_energy, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.plant_state`,
          { val: plantStatus, ack: true }
        );
      } else {
        this.log.debug("Did not receive a correct response from the Stationdetails API call");
      }
    } catch (e) {
      this.log.error(`Error while calling API (Station): ${e} `);
    }
    try {
      const inverterResult = await (0, import_apiHelper.getInverterDetails)(
        this.config.plantId,
        this.config.apiKey,
        this.config.apiSecret,
        this.log
      );
      this.log.debug(`Correct result from Inverter API call, inverter state: ${inverterResult.inverter_state}`);
      let inverterStatus = "";
      switch (inverterResult.inverter_state) {
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
      this.log.debug(`set inverter state to: ${inverterStatus}`);
      if (inverterResult) {
        await this.setStateAsync(
          `${this.config.plantId}.energy_day`,
          { val: inverterResult.etoday, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.inverter_state`,
          { val: inverterStatus, ack: true }
        );
      }
    } catch (e) {
      this.log.error(`error while calling API (Inverter): ${e}`);
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
