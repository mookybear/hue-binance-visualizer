# hue-binance-visualizer

> show binance price data by changing the color and intensity of a Phillips Hue smartbulb

https://www.reddit.com/r/CryptoCurrency/comments/9e6jh4/lightbulb_changes_color_and_intensity_based_on/

## Usage
This module connects to a Binance websocket to retrieve real-time price data and visualizes the percentage change every interval (1m, 5m, 1h, etc) by changing the intensity (green/red) and brightness of a Phillips Hue color smartbulb. You'll need a Phillips Hue Bridge and Phillips Hue color bulb on your home wifi, and a Binance API account.

 example.js (in this repo, also shown below) shows how to use this module:

```javascript
(async function () {
    const visualizer = require('./index.js');
    const host = await visualizer.getHueHost();
    const user = await visualizer.createHueUser('binance visualizer', host); // For this step to work, you have to press the link button on your Hue Bridge before running the script
    const binanceOptions = {
        key: '<YOUR BINANCE API KEY HERE>',
        secret: '<YOUR BINANCE API SECRET HERE>',
        interval: '1m',
        tradingPair: 'BTCUSDT'
    };
    const hueOptions = {
        host: host,
        user: user,
        lightName: '<YOUR HUE LIGHT NAME HERE>', // name can be set in the Phillips Hue app
        brightness: 40
    };
    visualizer.visualizePriceData(binanceOptions, hueOptions);
}());
```

## Contribute
PRs accepted.

## License
MIT