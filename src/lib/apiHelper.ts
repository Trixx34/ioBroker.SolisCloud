import axios from "axios";
import crypto from "crypto";
const API_BASE_URL = "https://www.soliscloud.com:13333";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function getStationDetails(
  this: any,
  stationId: string,
  apiKey: string,
  apiSecret: string,
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
  //todo fix logging in apihelper
  //this.log.debug(    `Encrypted SHA1 (this can NOT be retraced to your API secret): ${sign}`,  );
  const url = API_BASE_URL + "/v1/api/stationDetail";
  try {
    const requestBody = JSON.stringify(map);
    //this.log.debug(`Requestbody: ${JSON.stringify(map)}`);
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
    //this.log.debug(`API response was: ${response.data}`);
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
    };
  } catch (error) {
    this.log.error(error);
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
  return `${days[cd.getUTCDay()]}, ${cd.getUTCDate()} ${
    months[cd.getUTCMonth()]
  } ${cd.getUTCFullYear()} ${cd.getUTCHours()}:${cd.getUTCMinutes()}:${cd.getUTCSeconds()} GMT`;
}

export function getDigest(test: string): string {
  const md5 = crypto.createHash("md5");
  md5.update(test);
  return md5.digest("base64");
}
