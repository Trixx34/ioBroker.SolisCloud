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
) {
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
  apiLogger.debug(`Encrypted sign for StationDetails call (this can NOT be retraced to your API key/secret): ${sign}`);
  const url = API_BASE_URL + "/v1/api/stationDetail";
  apiLogger.debug(`Stationdetails URL: ${url}`);
  try {
    const requestBody = JSON.stringify(map);
    //this.log.debug(`Request body: ${JSON.stringify(map)}`);
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
    apiLogger.silly(`API response (Station) was: ${response.data.data}`);
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
    };
  } catch (error) {
    apiLogger.error(error);
  }
}

export async function getInverterDetails(
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
  apiLogger.debug(`Encrypted sign for InverterDetails call (this can NOT be retraced to your API key/secret): ${sign}`);
  const url = API_BASE_URL + "/v1/api/inverterList";
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
    apiLogger.silly(`API response (Inverter) was: ${response.data.data}`);
    return {
      inverter_state: response.data.data.page.records[0].state,
      etoday: response.data.data.page.records[0].etoday,
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
