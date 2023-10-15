import * as utils from "@iobroker/adapter-core";
import { getStationDetails } from "./lib/apiHelper";
import "./lib/apiHelper";

class soliscloud extends utils.Adapter {
  private running = false;
  public constructor(options: Partial<utils.AdapterOptions> = {}) {
    super({
      ...options,
      name: "soliscloud",
    });
    this.on("ready", this.onReady.bind(this));
    // this.on("stateChange", this.onStateChange.bind(this));
    // this.on("objectChange", this.onObjectChange.bind(this));
    // this.on("message", this.onMessage.bind(this));
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
            role: "value",
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
            role: "value",
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
            role: "value",
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
          role: "value",
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
            role: "value",
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
            role: "value",
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
            role: "value",
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
            role: "value",
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
            role: "value",
            read: true,
            write: true,
          },
          native: {},
        },
      );
    }

    if (this.config.apiKey && this.config.apiSecret && this.config.plantId) {
      this.log.info(
        `Start polling soliscloud, polling every ${this.config.pollInterval} seconds`,
      );
      this.running = true;
      //TODO change to use interval
      while (this.running) {
        try {
          const callResult = await getStationDetails(
            this.config.plantId,
            this.config.apiKey,
            this.config.apiSecret,
          );
          await this.setStateAsync(
            `${this.config.plantId}.current_consumption`,
            callResult?.current_consumption,
          );
          await this.setStateAsync(
            `${this.config.plantId}.current_power`,
            callResult?.current_power,
          );
          await this.setStateAsync(
            `${this.config.plantId}.current_from_net`,
            callResult?.current_from_net,
          );
          await this.setStateAsync(
            `${this.config.plantId}.sold_today`,
            callResult?.sold_today,
          );
          await this.setStateAsync(
            `${this.config.plantId}.generated_today`,
            callResult?.generated_today,
          );
          await this.setStateAsync(
            `${this.config.plantId}.bought_today`,
            callResult?.bought_today,
          );
          await this.setStateAsync(
            `${this.config.plantId}.consumption_today`,
            callResult?.consumption_today,
          );
          await this.setStateAsync(
            `${this.config.plantId}.battery_percent`,
            callResult?.battery_percent,
          );
          await this.setStateAsync(
            `${this.config.plantId}.battery_current_usage`,
            callResult?.battery_current_usage,
          );

          //Wait 30 seconds and loop again. #TODO make interval configurable
          await new Promise((resolve) => setTimeout(resolve, 30000));
        } catch (e) {
          this.log.error(
            `Error while calling solis api, retrying in ${this.config.pollInterval} seconds.`,
          );
          this.log.error(`Error was: ${e}`);
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.pollInterval * 1000),
          );
        }
      }
    } else {
      this.log.error("Can't start polling, missing needed settings.");
    }
  }
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   */
  private onUnload(callback: () => void): void {
    try {
      this.log.info("Stopping soliscloud polling");
      this.running = false;
      callback();
    } catch (e) {
      this.log.info("Error while stopping polling: " + e);
      callback();
    }
  }
}

if (require.main !== module) {
  // Export the constructor in compact mode
  module.exports = (options: Partial<utils.AdapterOptions> | undefined) =>
    new soliscloud(options);
} else {
  // otherwise start the instance directly
  (() => new soliscloud())();
}
