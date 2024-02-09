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
var import_createObjects = require("./lib/createObjects");
class soliscloud extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "soliscloud"
    });
    this.sentryInstance = this.getSentryInstance();
    this.on("ready", this.onReady.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    this.log.info("Starting soliscloud adapter");
    this.log.info(`Debuglogging is ${this.config.debugLogging}`);
    if (this.config.plantId != null) {
      this.config.plantId = this.name2id(this.config.plantId);
      (0, import_createObjects.createObjects)(this);
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
          "battery_year_discharge_energy_units"
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
      const inverterDetailResult = await (0, import_apiHelper.getInverterList)(
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
          { val: inverterDetailResult.etoday, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.inverter_detail.state`,
          { val: inverterStatus, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.inverter_detail.id`,
          { val: inverterDetailResult.inverter_id, ack: true }
        );
        await this.setStateAsync(
          `${this.config.plantId}.inverter_detail.serial_number`,
          { val: inverterDetailResult.inverter_serial_number, ack: true }
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
          const inverterDetails = await (0, import_apiHelper.getInverterDetails)(this, inverterId);
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
              "battery_total_discharge_energy_units"
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
      (0, import_apiHelper.getEpmDetails)(this);
    }
  }
  getSentryInstance() {
    if (this.supportsFeature && this.supportsFeature("PLUGINS")) {
      return this.getPluginInstance("sentry");
    }
  }
  onUnload(callback) {
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
  module.exports = (options) => new soliscloud(options);
} else {
  (() => new soliscloud())();
}
//# sourceMappingURL=main.js.map
