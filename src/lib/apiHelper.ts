import axios from "axios";
import crypto from "crypto";
const API_BASE_URL = "https://www.soliscloud.com:13333";

export async function getStationDetails(stationId: string, apiKey: string, apiSecret: string) {
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
        });
        //console.log(response.data.data);
        return {
            current_Power: response.data.data.power,
            current_consumption: response.data.data.familyLoadPower,
            current_From_Net: response.data.data.psum,
            sold_Today: response.data.data.gridSellDayEnergy,
            generated_Today: response.data.data.dayEnergy,
            bought_Today: response.data.data.gridPurchasedDayEnergy,
            consumption_Today: response.data.data.homeLoadEnergy,
            battery_percent: response.data.data.batteryPercent,
            battery_current_usage: response.data.data.batteryPower,
        };
    } catch (error) {
        console.error(error);
    }
}

export function HmacSHA1Encrypt(encryptText: string, keySecret: string):string {
    const keyBuffer = Buffer.from(keySecret, "utf-8");
    const hmac = crypto.createHmac("sha1", keyBuffer);
    hmac.update(encryptText, "utf-8");
    const resultBuffer = hmac.digest();
    return resultBuffer.toString("base64");
}

export function getGMTTime():string {
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

    return `${days[cd.getUTCDay()]}, ${cd.getUTCDate()} ${months[cd.getUTCMonth()]} ${cd.getUTCFullYear()} ${cd.getUTCHours()}:${cd.getUTCMinutes()}:${cd.getUTCSeconds()} GMT`;
}

export function getDigest(test:string):string {
    const md5 = crypto.createHash("md5");
    md5.update(test);
    return md5.digest("base64");
}