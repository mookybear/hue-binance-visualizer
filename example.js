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
