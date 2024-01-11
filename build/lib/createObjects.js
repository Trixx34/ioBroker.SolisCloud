"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var createObjects_exports = {};
__export(createObjects_exports, {
  createObjects: () => createObjects
});
module.exports = __toCommonJS(createObjects_exports);
async function createObjects(adapter) {
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.current_consumption`,
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
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.current_power`,
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
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.current_from_net`,
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
  await adapter.setObjectNotExistsAsync(`${adapter.config.plantId}.station_detail.sold_today`, {
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
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.generated_today`,
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
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.bought_today`,
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
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.consumption_today`,
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
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.battery_percent`,
    {
      type: "state",
      common: {
        name: "battery_percent",
        type: "number",
        role: "value.battery",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.battery_current_usage`,
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
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.total_consumption_energy`,
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
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.self_consumption_energy`,
    {
      type: "state",
      common: {
        name: "self_consumption_energy",
        type: "number",
        unit: "W",
        role: "value.power",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.plant_state`,
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
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.battery_month_charge_energy`,
    {
      type: "state",
      common: {
        name: "battery_month_charge_energy",
        type: "number",
        role: "value.power",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.battery_month_charge_energy_units`,
    {
      type: "state",
      common: {
        name: "battery_month_charge_energy_units",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.battery_year_charge_energy`,
    {
      type: "state",
      common: {
        name: "battery_year_charge_energy",
        type: "number",
        role: "value.power",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.battery_year_charge_energy_units`,
    {
      type: "state",
      common: {
        name: "battery_year_charge_energy_units",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.battery_month_discharge_energy`,
    {
      type: "state",
      common: {
        name: "battery_month_discharge_energy",
        type: "number",
        role: "value.power",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.battery_month_discharge_energy_units`,
    {
      type: "state",
      common: {
        name: "battery_month_discharge_units",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.battery_year_discharge_energy`,
    {
      type: "state",
      common: {
        name: "battery_year_discharge",
        type: "number",
        role: "value.power",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.station_detail.battery_year_discharge_energy_units`,
    {
      type: "state",
      common: {
        name: "battery_year_discharge_units",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.energy_day`,
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
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.state`,
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
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.ac_current_R`,
    {
      type: "state",
      common: {
        name: "ac_current_R",
        type: "number",
        role: "value.current",
        unit: "A",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.ac_current_S`,
    {
      type: "state",
      common: {
        name: "ac_current_S",
        type: "number",
        role: "value.current",
        unit: "A",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.ac_current_T`,
    {
      type: "state",
      common: {
        name: "ac_current_T",
        type: "number",
        role: "value.current",
        unit: "A",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.ac_voltage_R`,
    {
      type: "state",
      common: {
        name: "ac_voltage_R",
        type: "number",
        role: "value.voltage",
        unit: "V",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.ac_voltage_S`,
    {
      type: "state",
      common: {
        name: "ac_voltage_S",
        type: "number",
        role: "value.voltage",
        unit: "V",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.ac_voltage_T`,
    {
      type: "state",
      common: {
        name: "ac_voltage_T",
        type: "number",
        role: "value.voltage",
        unit: "V",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.id`,
    {
      type: "state",
      common: {
        name: "id",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.serial_number`,
    {
      type: "state",
      common: {
        name: "serial_number",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.family_load_power_units`,
    {
      type: "state",
      common: {
        name: "family_load_power_units",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.family_load_power`,
    {
      type: "state",
      common: {
        name: "family_load_power",
        type: "number",
        role: "value.power",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.temperature`,
    {
      type: "state",
      common: {
        name: "temperature",
        type: "number",
        role: "value.temperature",
        unit: "\xB0C",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.battery_today_charge_energy`,
    {
      type: "state",
      common: {
        name: "battery_today_charge_energy",
        type: "number",
        role: "value.power",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.battery_today_charge_energy_units`,
    {
      type: "state",
      common: {
        name: "battery_today_charge_energy_units",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.battery_total_charge_energy`,
    {
      type: "state",
      common: {
        name: "battery_total_charge_energy",
        type: "number",
        role: "value.power",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.battery_total_charge_energy_units`,
    {
      type: "state",
      common: {
        name: "battery_total_charge_energy_units",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.battery_today_discharge_energy`,
    {
      type: "state",
      common: {
        name: "battery_today_discharge_energy_units",
        type: "number",
        role: "value.power",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.battery_today_discharge_energy_units`,
    {
      type: "state",
      common: {
        name: "battery_today_discharge_energy_units",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.battery_total_discharge_energy`,
    {
      type: "state",
      common: {
        name: "battery_total_discharge",
        type: "number",
        role: "value.power",
        read: true,
        write: false
      },
      native: {}
    }
  );
  await adapter.setObjectNotExistsAsync(
    `${adapter.config.plantId}.inverter_detail.battery_total_discharge_energy_units`,
    {
      type: "state",
      common: {
        name: "battery_total_discharge_units",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createObjects
});
//# sourceMappingURL=createObjects.js.map
