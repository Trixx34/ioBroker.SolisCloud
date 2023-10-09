![Logo](admin/solis.png)

[![NPM version](http://img.shields.io/npm/v/iobroker.soliscloud)](https://www.npmjs.com/package/iobroker.soliscloud)

## soliscloud adapter for IOBroker

Version 1.0.0

This integration is based on this home-assistant integration:
https://github.com/hultenvp/solis-sensor


The steps to get the needed data to use the integration are as following:

Create a ticket with ginlong to request enabling API access on your account and wait untill they confirm the change

- Go to https://www.soliscloud.com/#/apiManage.
- Activate API management and agree with the usage conditions.
- After activation, click on view key tot get a pop-up window asking for the verification code.
- First click on "Verification code" after which you get an image with 2 puzzle pieces, which you need to overlap each other using the slider below.
- After that, you will receive an email with the verification code you need to enter (within 60 seconds).
- Once confirmed, you get the API ID, secret and API URL

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

This adapter is still very new, I'm not a professional developer. Use at your own risk.


[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg)](https://www.buymeacoffee.com/trixxdev)

## Changelog

- Split api logic in separate files
- various update to comply with publishing rules

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
