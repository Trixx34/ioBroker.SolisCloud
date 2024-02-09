"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var apiHelper_exports = {};
__export(apiHelper_exports, {
  HmacSHA1Encrypt: () => HmacSHA1Encrypt,
  createSentryInstance: () => createSentryInstance,
  getDigest: () => getDigest,
  getEpmDetails: () => getEpmDetails,
  getGMTTime: () => getGMTTime,
  getInverterDetails: () => getInverterDetails,
  getInverterList: () => getInverterList,
  getStationDetails: () => getStationDetails
});
module.exports = __toCommonJS(apiHelper_exports);
var import_axios = __toESM(require("axios"));
var import_crypto = __toESM(require("crypto"));
const API_BASE_URL = "https://www.soliscloud.com:13333";
const timeoutMs = 7e3;
async function getStationDetails(adapter) {
  var _a;
  const map = {
    id: adapter.config.plantId
  };
  const body = JSON.stringify(map);
  const ContentMd5 = getDigest(body);
  const currentDate = getGMTTime();
  const param = "POST\n" + ContentMd5 + "\napplication/json\n" + currentDate + "\n/v1/api/stationDetail";
  const sign = HmacSHA1Encrypt(param, adapter.config.apiSecret);
  const url = API_BASE_URL + "/v1/api/stationDetail";
  if (adapter.config.debugLogging) {
    adapter.log.debug(`Stationdetails URL: ${url}`);
  }
  try {
    const requestBody = JSON.stringify(map);
    const response = await (0, import_axios.default)({
      method: "post",
      url,
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `API ${adapter.config.apiKey}:${sign}`,
        "Content-MD5": ContentMd5,
        Date: currentDate
      },
      data: requestBody,
      timeout: timeoutMs
    });
    if (adapter.config.debugLogging) {
      adapter.log.debug(`API response (Station) was:` + JSON.stringify(response.data));
    }
    if ((_a = response.data) == null ? void 0 : _a.data) {
      const record = response.data.data;
      return {
        current_power: record.power,
        current_consumption: record.familyLoadPower,
        current_from_net: record.psum,
        sold_today: record.gridSellDayEnergy,
        generated_today: record.dayEnergy,
        bought_today: record.gridPurchasedDayEnergy,
        consumption_today: record.homeLoadEnergy,
        battery_percent: record.batteryPercent,
        battery_current_usage: record.batteryPower,
        battery_today_charge: record.batteryChargeEnergy,
        battery_today_discharge: record.batteryDischargeEnergy,
        total_consumption_energy: record.homeLoadEnergy,
        self_consumption_energy: record.oneSelf,
        plant_state: record.state,
        battery_month_charge_energy: record.batteryChargeMonthEnergy,
        battery_month_charge_energy_units: record.batteryChargeMonthEnergyStr,
        battery_year_charge_energy: record.batteryChargeYearEnergy,
        battery_year_charge_energy_units: record.batteryChargeYearEnergyStr,
        battery_month_discharge_energy: record.batteryDischargeMonthEnergy,
        battery_month_discharge_energy_units: record.batteryDischargeMonthEnergyStr,
        battery_year_discharge_energy: record.batteryDischargeYearEnergy,
        battery_year_discharge_energy_units: record.batteryDischargeYearEnergyStr
      };
    } else {
      adapter.log.error("GetStationDetails: could not parse result. Turn on debug logging for more info");
    }
  } catch (error) {
    adapter.sentryInstance.getSentryObject().captureException(error);
  }
}
async function getInverterList(adapter) {
  var _a, _b, _c;
  const map = {
    pageNo: 1,
    pageSize: 20,
    stationId: adapter.config.plantId
  };
  const body = JSON.stringify(map);
  const ContentMd5 = getDigest(body);
  const currentDate = getGMTTime();
  const param = "POST\n" + ContentMd5 + "\napplication/json\n" + currentDate + "\n/v1/api/inverterList";
  const sign = HmacSHA1Encrypt(param, adapter.config.apiSecret);
  const url = API_BASE_URL + "/v1/api/inverterList";
  if (adapter.config.debugLogging) {
    adapter.log.debug(`Inverterlist URL: ${url}`);
  }
  try {
    const requestBody = body;
    const response = await (0, import_axios.default)({
      method: "post",
      url,
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `API ${adapter.config.apiKey}:${sign}`,
        "Content-MD5": ContentMd5,
        Date: currentDate
      },
      data: requestBody,
      timeout: timeoutMs
    });
    if (adapter.config.debugLogging) {
      adapter.log.debug(`API response (InverterList) was:` + JSON.stringify(response.data.data.page.records[0]));
    }
    if ((_c = (_b = (_a = response.data) == null ? void 0 : _a.data) == null ? void 0 : _b.page) == null ? void 0 : _c.records[0]) {
      const record = response.data.data.page.records[0];
      return {
        inverter_state: record.state,
        etoday: record.etoday,
        inverter_id: record.id,
        inverter_serial_number: record.sn
      };
    } else {
      adapter.log.error("GetInverterDetails: could not parse result. Turn on debug logging for more info");
    }
  } catch (e) {
    adapter.sentryInstance.getSentryObject().captureException(e);
  }
}
async function getInverterDetails(adapter, inverterId) {
  var _a;
  const map = {
    id: inverterId
  };
  const body = JSON.stringify(map);
  const ContentMd5 = getDigest(body);
  const currentDate = getGMTTime();
  const param = "POST\n" + ContentMd5 + "\napplication/json\n" + currentDate + "\n/v1/api/inverterDetail";
  const sign = HmacSHA1Encrypt(param, adapter.config.apiSecret);
  const url = API_BASE_URL + "/v1/api/inverterDetail";
  if (adapter.config.debugLogging) {
    adapter.log.debug(`Inverterdetails URL: ${url}`);
  }
  try {
    const requestBody = JSON.stringify(map);
    const response = await (0, import_axios.default)({
      method: "post",
      url,
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `API ${adapter.config.apiKey}:${sign}`,
        "Content-MD5": ContentMd5,
        Date: currentDate
      },
      data: requestBody,
      timeout: timeoutMs
    });
    if (adapter.config.debugLogging) {
      adapter.log.debug(`API response (Inverterdetail) was:` + JSON.stringify(response.data.data));
    }
    if ((_a = response.data) == null ? void 0 : _a.data) {
      const record = response.data.data;
      return {
        ac_current_R: record.iAc1,
        ac_current_S: record.iAc2,
        ac_current_T: record.iAc3,
        ac_voltage_R: record.uAc1,
        ac_voltage_S: record.uAc2,
        ac_voltage_T: record.uAc3,
        family_load_power_units: record.familyLoadPowerStr,
        family_load_power: record.familyLoadPower,
        temperature: record.inverterTemperature,
        battery_power: record.batteryPower,
        battery_power_units: record.batterypowerStr,
        battery_power_percentage: record.batteryPowerPec,
        battery_today_charge_energy: record.batteryTodayChargeEnergy,
        battery_today_charge_energy_units: record.batteryTodayChargeEnergyStr,
        battery_total_charge_energy: record.batteryTotalChargeEnergy,
        battery_total_charge_energy_units: record.batteryTotalChargeEnergyStr,
        battery_today_discharge_energy: record.batteryTodayDischargeEnergy,
        battery_today_discharge_energy_units: record.batteryTodayDischargeEnergyStr,
        battery_total_discharge_energy: record.batteryTotalDischargeEnergy,
        battery_total_discharge_energy_units: record.batteryTotalDischargeEnergyStr
      };
    } else {
      adapter.log.error("GetInverterDetails: could not parse result. Turn on debug logging for more info");
    }
  } catch (e) {
    adapter.sentryInstance.getSentryObject().captureException(e);
  }
}
async function getEpmDetails(adapter) {
  const map = {
    pageNo: 1,
    pageSize: 20,
    id: adapter.config.plantId
  };
  const body = JSON.stringify(map);
  const ContentMd5 = getDigest(body);
  const currentDate = getGMTTime();
  const param = "POST\n" + ContentMd5 + "\napplication/json\n" + currentDate + "\n/v1/api/epmList";
  const sign = HmacSHA1Encrypt(param, adapter.config.apiSecret);
  const url = API_BASE_URL + "/v1/api/epmList";
  if (adapter.config.debugLogging) {
    adapter.log.debug(`EPMlist URL: ${url}`);
  }
  try {
    const requestBody = JSON.stringify(map);
    const response = await (0, import_axios.default)({
      method: "post",
      url,
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `API ${adapter.config.apiKey}:${sign}`,
        "Content-MD5": ContentMd5,
        Date: currentDate
      },
      data: requestBody,
      timeout: timeoutMs
    });
    if (adapter.config.debugLogging) {
      adapter.log.debug(`API response (EPM detail) was:` + JSON.stringify(response.data));
    }
    return {};
  } catch (e) {
    adapter.sentryInstance.getSentryObject().captureException(e);
  }
}
function HmacSHA1Encrypt(encryptText, keySecret) {
  const keyBuffer = Buffer.from(keySecret, "utf-8");
  const hmac = import_crypto.default.createHmac("sha1", keyBuffer);
  hmac.update(encryptText, "utf-8");
  const resultBuffer = hmac.digest();
  return resultBuffer.toString("base64");
}
function getGMTTime() {
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
function getDigest(test) {
  const md5 = import_crypto.default.createHash("md5");
  md5.update(test);
  return md5.digest("base64");
}
function createSentryInstance(adapter) {
  if (adapter.supportsFeature && adapter.supportsFeature("PLUGINS")) {
    const sentryInstance = adapter.getPluginInstance("sentry");
    return sentryInstance;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HmacSHA1Encrypt,
  createSentryInstance,
  getDigest,
  getEpmDetails,
  getGMTTime,
  getInverterDetails,
  getInverterList,
  getStationDetails
});
//# sourceMappingURL=apiHelper.js.map
