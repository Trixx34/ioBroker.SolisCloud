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
    this.running = false;
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    this.log.info("Starting soliscloud adapter");
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
      this.log.info(`Start polling soliscloud, polling every ${this.config.pollInterval} seconds`);
      this.running = true;
      while (this.running) {
        try {
          const callResult = await (0, import_apiHelper.getStationDetails)(this.config.plantId, this.config.apiKey, this.config.apiSecret);
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
        } catch (e) {
          this.log.error(`Error while calling solis api, retrying in ${this.config.pollInterval} seconds`);
          await new Promise((resolve) => setTimeout(resolve, this.config.pollInterval * 1e3));
        }
      }
    } else {
      this.log.info("Can't start polling, missing needed settings.");
    }
  }
  onUnload(callback) {
    try {
      this.log.info("Stopping soliscloud polling");
      this.running = false;
      callback();
    } catch (e) {
      this.log.info("Error while stopping polling: " + e);
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
}
if (require.main !== module) {
  module.exports = (options) => new soliscloud(options);
} else {
  (() => new soliscloud())();
}
//# sourceMappingURL=main.js.map
