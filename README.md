![Logo](admin/solis.png)
## SolisCloud adapter for IOBroker

This integration is heavily based on this home-assistant integration:
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
