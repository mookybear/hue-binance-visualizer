const hue = require("node-hue-api");
const change = require('percent-change');
const converter = require('@q42philips/hue-color-converter');

function normalize(val) {
    return (val - 0) / (1 - 0);
}

module.exports.getHueHost = async function() {
    const bridges = await hue.nupnpSearch();
    return bridges[0].ipaddress;
}

module.exports.createHueUser = async function(username, host) {
    let h = new hue.HueApi();
    return h.registerUser(host, username);
}

module.exports.visualizePriceData = async function(binanceOptions, hueOptions) {
    const { host, user, lightName, brightness } = hueOptions;
    const { key, secret, interval, tradingPair } = binanceOptions;
    const api = new hue.HueApi(host, user);
    const lightsResponse = await api.lights();
    const lights = lightsResponse.lights;
    const light = lights.filter(l => l.name === lightName)[0].id;
    let lastClose = null;
    let lastColor = null;

    api.setLightState(light, { on: true, brightness: brightness, saturation: 255 });

    const binance = require('node-binance-api')().options({
        APIKEY: key,
        APISECRET: secret,
        useServerTime: true,
        test: true
    });

    console.log('Connecting to Binance websocket and waiting for ' + interval + ' candle to close for ' + tradingPair);
    binance.websockets.candlesticks([tradingPair], interval, (data) => {
        let thisColor;
        let isFinal = data.k.x;
        let close = data.k.c;
        if (isFinal) {
            if (!lastClose) lastClose = parseFloat(data.k.o); // open
            close = parseFloat(close);
            let pct = change(lastClose, close);
            console.log(interval + ' candle closed at ' + close + ' for ' + tradingPair + ' for a ' + (close - lastClose) + ' change');
            let sat = 100 * pct;
            let normalizedSat = normalize(sat);
            normalizedSat = Math.abs(Number((normalizedSat * 255).toFixed(2)));
            let supporting = 50 - normalizedSat;
            let primary = 100 + normalizedSat;
            if (pct > 0) {
                thisColor = [supporting, primary, 0];
            } else if (pct < 0) {
                thisColor = [primary, supporting, 0];
            } else {
                thisColor = lastColor;
            }
            api.setLightState(light, {
                xy: converter.calculateXY(thisColor[0], thisColor[1], thisColor[2]),
                brightness: brightness + normalizedSat
            });
            lastClose = close;
            lastColor = thisColor;
        }
    });
}