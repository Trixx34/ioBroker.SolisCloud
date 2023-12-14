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
  getDigest: () => getDigest,
  getEplDetails: () => getEplDetails,
  getGMTTime: () => getGMTTime,
  getInverterDetails: () => getInverterDetails,
  getInverterList: () => getInverterList,
  getStationDetails: () => getStationDetails
});
module.exports = __toCommonJS(apiHelper_exports);
var import_axios = __toESM(require("axios"));
var import_crypto = __toESM(require("crypto"));
const API_BASE_URL = "https://www.soliscloud.com:13333";
async function getStationDetails(stationId, apiKey, apiSecret, apiLogger) {
  const map = {
    id: stationId
  };
  const body = JSON.stringify(map);
  const ContentMd5 = getDigest(body);
  const currentDate = getGMTTime();
  const param = "POST\n" + ContentMd5 + "\napplication/json\n" + currentDate + "\n/v1/api/stationDetail";
  const sign = HmacSHA1Encrypt(param, apiSecret);
  const url = API_BASE_URL + "/v1/api/stationDetail";
  apiLogger.debug(`Stationdetails URL: ${url}`);
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
      data: requestBody,
      timeout: 5e3
    });
    return {
      current_power: response.data.data.power,
      current_consumption: response.data.data.familyLoadPower,
      current_from_net: response.data.data.psum,
      sold_today: response.data.data.gridSellDayEnergy,
      generated_today: response.data.data.dayEnergy,
      bought_today: response.data.data.gridPurchasedDayEnergy,
      consumption_today: response.data.data.homeLoadEnergy,
      battery_percent: response.data.data.batteryPercent,
      battery_current_usage: response.data.data.batteryPower,
      battery_today_charge: response.data.data.batteryChargeEnergy,
      battery_today_discharge: response.data.data.batteryDischargeEnergy,
      total_consumption_energy: response.data.data.homeLoadEnergy,
      self_consumption_energy: response.data.data.oneSelf,
      plant_state: response.data.data.state,
      battery_month_charge_energy: response.data.data.batteryChargeMonthEnergy,
      battery_month_charge_energy_units: response.data.data.batteryChargeMonthEnergyStr,
      battery_year_charge_energy: response.data.data.batteryChargeYearEnergy,
      battery_year_charge_energy_units: response.data.data.batteryChargeYearEnergyStr,
      battery_month_discharge_energy: response.data.data.batteryDischargeMonthEnergy,
      battery_month_discharge_energy_units: response.data.data.batteryDischargeMonthEnergyStr,
      battery_year_discharge_energy: response.data.data.batteryDischargeYearEnergy,
      battery_year_discharge_energy_units: response.data.data.batteryDischargeYearEnergyStr
    };
  } catch (error) {
    apiLogger.error(error);
  }
}
async function getInverterList(stationId, apiKey, apiSecret, apiLogger) {
  const map = {
    pageNo: 1,
    pageSize: 20,
    stationId
  };
  const body = JSON.stringify(map);
  const ContentMd5 = getDigest(body);
  const currentDate = getGMTTime();
  const param = "POST\n" + ContentMd5 + "\napplication/json\n" + currentDate + "\n/v1/api/inverterList";
  const sign = HmacSHA1Encrypt(param, apiSecret);
  const url = API_BASE_URL + "/v1/api/inverterList";
  apiLogger.debug(`Inverterlist URL: ${url}`);
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
      data: requestBody,
      timeout: 5e3
    });
    return {
      inverter_state: response.data.data.page.records[0].state,
      etoday: response.data.data.page.records[0].etoday,
      inverter_id: response.data.data.page.records[0].id,
      inverter_serial_number: response.data.data.page.records[0].sn
    };
  } catch (e) {
    apiLogger.error(e);
  }
}
async function getInverterDetails(inverterId, apiKey, apiSecret, apiLogger) {
  const map = {
    id: inverterId
  };
  const body = JSON.stringify(map);
  const ContentMd5 = getDigest(body);
  const currentDate = getGMTTime();
  const param = "POST\n" + ContentMd5 + "\napplication/json\n" + currentDate + "\n/v1/api/inverterDetail";
  const sign = HmacSHA1Encrypt(param, apiSecret);
  const url = API_BASE_URL + "/v1/api/inverterDetail";
  apiLogger.debug(`Inverterdetails URL: ${url}`);
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
      data: requestBody,
      timeout: 5e3
    });
    return {
      ac_current_R: response.data.data.iAc1,
      ac_current_S: response.data.data.iAc2,
      ac_current_T: response.data.data.iAc3,
      ac_voltage_R: response.data.data.uAc1,
      ac_voltage_S: response.data.data.uAc2,
      ac_voltage_T: response.data.data.uAc3,
      family_load_power_units: response.data.data.familyLoadPowerStr,
      family_load_power: response.data.data.familyLoadPower,
      temperature: response.data.data.inverterTemperature,
      battery_power: response.data.data.batteryPower,
      battery_power_units: response.data.data.batterypowerStr,
      battery_power_percentage: response.data.data.batteryPowerPec,
      battery_today_charge_energy: response.data.data.batteryTodayChargeEnergy,
      battery_today_charge_energy_units: response.data.data.batteryTodayChargeEnergyStr,
      battery_total_charge_energy: response.data.data.batteryTotalChargeEnergy,
      battery_total_charge_energy_units: response.data.data.batteryTotalChargeEnergyStr,
      battery_today_discharge_energy: response.data.data.batteryTodayDischargeEnergy,
      battery_today_discharge_energy_units: response.data.data.batteryTodayDischargeEnergyStr,
      battery_total_discharge_energy: response.data.data.batteryTotalDischargeEnergy,
      battery_total_discharge_energy_units: response.data.data.batteryTotalDischargeEnergyStr
    };
  } catch (e) {
    apiLogger.error(e);
  }
}
async function getEplDetails(inverterId, apiKey, apiSecret, apiLogger) {
  const map = {
    id: inverterId
  };
  const body = JSON.stringify(map);
  const ContentMd5 = getDigest(body);
  const currentDate = getGMTTime();
  const param = "POST\n" + ContentMd5 + "\napplication/json\n" + currentDate + "\n/v1/api/inverterDetail";
  const sign = HmacSHA1Encrypt(param, apiSecret);
  const url = API_BASE_URL + "/v1/api/inverterDetail";
  apiLogger.debug(`Inverterdetails URL: ${url}`);
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
      data: requestBody,
      timeout: 5e3
    });
    return {};
  } catch (e) {
    apiLogger.error(e);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HmacSHA1Encrypt,
  getDigest,
  getEplDetails,
  getGMTTime,
  getInverterDetails,
  getInverterList,
  getStationDetails
});
//# sourceMappingURL=apiHelper.js.map
