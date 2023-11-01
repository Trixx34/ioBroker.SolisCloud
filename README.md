![Logo](admin/solis.png)

[![NPM version](http://img.shields.io/npm/v/iobroker.soliscloud)](https://www.npmjs.com/package/iobroker.soliscloud)

## soliscloud adapter for IOBroker

This integration is based on this home-assistant integration:
https://github.com/hultenvp/solis-sensor

The steps to get the needed data to use the integration are as following:

Create a ticket with ginlong to request enabling API access on your account and wait untill they confirm the change
You can find the contact information for your region here: https://www.solisinverters.com/global/contactus.html

- Go to https://www.soliscloud.com/#/apiManage.
- Activate API management and agree with the usage conditions.
- After activation, click on view key tot get a pop-up window asking for the verification code.
- First click on "Verification code" after which you get an image with 2 puzzle pieces, which you need to overlap each other using the slider below.
- After that, you will receive an email with the verification code you need to enter (within 60 seconds).
- Once confirmed, you get the API ID, secret and API URL
- The plant ID you need to enter in the settings is the ID found in the url once you are logged in. For example: soliscloud.com/#/station/stationdetail_1?id=**123486816843454864**

This adapter will read and store the following values into objects:

- battery_current_usage
- battery_percent
- bought_Today
- consumption_Today
- current_Consumption
- current_From_Net
- current_Power
- generated_Today
- sold_Today

The API returns other values that can be added, but at the moment these are sufficient for my needs.

## Current state

This adapter is still very new, but tested and seemingly stable.
I'm not a professional developer. Use at your own risk.

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg)](https://www.buymeacoffee.com/trixxdev)

## Changelog

### **WORK IN PROGRESS**

- added ack to value updates.

### 1.2.0 (2023-11-01)

- Adjusted processing of inverter API call.
- Fixed logging for API calls
- improved error handling
- write attribute set to false for all objects.

### 1.1.6 (2023-31-10)

- Added new values:
  from the Power Station List:
  batteryTodayDischargeEnergy
  batteryTodayChargeEnergy
  homeLoadTodayEnergy
  state
  oneSelf

  from the Inverter List:
  eToday
  etodayStr
  state

### 1.1.5 (2023-30-10)

- Updated minimum node version.
- Limited input to numerical values only for the plantID.
- removed some unneeded settings.
- updated translations.

### 1.1.4 (2023-24-10)

- Fixed issues with translations.

### 1.1.3 (2023-15-10)

- Switched to setInterval -> https://github.com/Trixx34/ioBroker.soliscloud/issues/12

### 1.0.3 (2023-15-10)

- Removed console logging
- Removed unused onStateChange handler
- Adjusted state-id naming
- Added units to values
- Added plant ID as root folder for objects

### 1.0.2 (2023-11-10)

- Translations
- Removed some unneeded files.

### 1.0.1 (2023-10-09)

- Fixed issue where pollinterval wasn't checked/used

### 1.0.0 (2023-10-09)

- Split api logic in separate files
- various updates to comply with publishing rules
- Initial release!

## License

MIT License

"Copyright (c) 2023 Trixx trixxdev034@gmail.com"

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
