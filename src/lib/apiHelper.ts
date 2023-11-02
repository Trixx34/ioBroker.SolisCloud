/* eslint-disable @typescript-eslint/indent */
import axios from "axios";
import crypto from "crypto";
const API_BASE_URL = "https://www.soliscloud.com:13333";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function getStationDetails(
  this: any,
  stationId: string,
  apiKey: string,
  apiSecret: string,
  apiLogger: any
): Promise<any> {
  const map = {
    id: stationId,
  };
  const body = JSON.stringify(map);
  const ContentMd5 = getDigest(body);
  const currentDate = getGMTTime();
  const param =
    "POST" +
    "\n" +
    ContentMd5 +
    "\n" +
    "application/json" +
    "\n" +
    currentDate +
    "\n" +
    "/v1/api/stationDetail";
  const sign = HmacSHA1Encrypt(param, apiSecret);
  const url = API_BASE_URL + "/v1/api/stationDetail";
  apiLogger.debug(`Stationdetails URL: ${url}`);
  try {
    const requestBody = JSON.stringify(map);
    const response = await axios({
      method: "post",
      url: url,
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `API ${apiKey}:${sign}`,
        "Content-MD5": ContentMd5,
        Date: currentDate,
      },
      data: requestBody,
      timeout: 5000,
    });
    //apiLogger.debug(`API response (Station) was:` + JSON.stringify(response.data.data));
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
      battery_year_discharge_energy_units: response.data.data.batteryDischargeYearEnergyStr,
    };
  } catch (error) {
    apiLogger.error(error);
  }
}

export async function getInverterList(
  this: any,
  stationId: string,
  apiKey: string,
  apiSecret: string,
  apiLogger: any
): Promise<any> {
  const map = {
    pageNo: 1,
    pageSize: 20,
    stationId: stationId
  };
  const body = JSON.stringify(map);
  const ContentMd5 = getDigest(body);
  const currentDate = getGMTTime();
  const param =
    "POST" +
    "\n" +
    ContentMd5 +
    "\n" +
    "application/json" +
    "\n" +
    currentDate +
    "\n" +
    "/v1/api/inverterList";
  const sign = HmacSHA1Encrypt(param, apiSecret);
  const url = API_BASE_URL + "/v1/api/inverterList";
  apiLogger.debug(`Inverterlist URL: ${url}`);
  try {
    const requestBody = JSON.stringify(map);
    const response = await axios({
      method: "post",
      url: url,
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `API ${apiKey}:${sign}`,
        "Content-MD5": ContentMd5,
        Date: currentDate,
      },
      data: requestBody,
      timeout: 5000,
    });
    //apiLogger.debug(`API response (InverterList) was:` + JSON.stringify(response.data.data.page.records[0]));
    return {
      inverter_state: response.data.data.page.records[0].state,
      etoday: response.data.data.page.records[0].etoday,
      inverter_id: response.data.data.page.records[0].id,
      inverter_serial_number: response.data.data.page.records[0].sn,
    }
  } catch (e) {
    apiLogger.error(e)
  }
}

export async function getInverterDetails(
  this: any,
  inverterId: string,
  apiKey: string,
  apiSecret: string,
  apiLogger: any
): Promise<any> {
  const map = {
    id: inverterId
  };
  const body = JSON.stringify(map);
  const ContentMd5 = getDigest(body);
  const currentDate = getGMTTime();
  const param =
    "POST" +
    "\n" +
    ContentMd5 +
    "\n" +
    "application/json" +
    "\n" +
    currentDate +
    "\n" +
    "/v1/api/inverterDetail";
  const sign = HmacSHA1Encrypt(param, apiSecret);
  const url = API_BASE_URL + "/v1/api/inverterDetail";
  apiLogger.debug(`Inverterdetails URL: ${url}`);
  try {
    const requestBody = JSON.stringify(map);
    const response = await axios({
      method: "post",
      url: url,
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `API ${apiKey}:${sign}`,
        "Content-MD5": ContentMd5,
        Date: currentDate,
      },
      data: requestBody,
      timeout: 5000,
    });
    //apiLogger.debug(`API response (Inverterdetail) was:` + JSON.stringify(response.data));
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
      battery_total_discharge_energy_units: response.data.data.batteryTotalDischargeEnergyStr,
    }
  } catch (e) {
    apiLogger.error(e)
  }
}

export function HmacSHA1Encrypt(
  encryptText: string,
  keySecret: string,
): string {
  const keyBuffer = Buffer.from(keySecret, "utf-8");
  const hmac = crypto.createHmac("sha1", keyBuffer);
  hmac.update(encryptText, "utf-8");
  const resultBuffer = hmac.digest();
  return resultBuffer.toString("base64");
}

export function getGMTTime(): string {
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
    "Dec",
  ];
  return `${days[cd.getUTCDay()]}, ${cd.getUTCDate()} ${months[cd.getUTCMonth()]
    } ${cd.getUTCFullYear()} ${cd.getUTCHours()}:${cd.getUTCMinutes()}:${cd.getUTCSeconds()} GMT`;
}

export function getDigest(test: string): string {
  const md5 = crypto.createHash("md5");
  md5.update(test);
  return md5.digest("base64");
}
