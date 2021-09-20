var kmh = 0;
var cache = []
cache.offset = 0;
var disp = document.getElementById("averageCounter");
var sum = 0;

var onSuccess = function (position) {
    kmh = position.coords.speed * 3.6
    kmh = kmh.toFixed(2)
    //console.log('Speed: ' + kmh + ' km/h\n')
    if (kmh <= 30 && kmh > 0) {
        g.refresh(kmh)
        cacheItem(kmh)
        for (let n = 0; n < 5; n++) {
            sum += cacheGet(n)
            console.log(n + ' ' + cacheGet(n))
        }
        sum = (sum / 6).toFixed(2);
        disp.innerHTML = sum
    }
};

// onError Callback receives a PositionError object
function onError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

navigator.geolocation.watchPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 30000,
    maxAge: 0,
    frequency: 1000
});

var g = new JustGage({
    id: "gauge",
    value: kmh,
    min: 0,
    max: 30,
    gaugeWidthScale: 0.2,
    refreshAnimationTime: 2000,
    donut: true,
    label: 'km/h',
    labelFontColor: '#232323',
    pointer: true,
    decimals: 2,
    pointerOptions: {
        toplength: null,
        bottomlength: null,
        bottomwidth: 10,
        stroke: 'none',
        stroke_width: 0,
        stroke_linecap: 'square',
        color: '#000000'
    }
});



//ring buffer to measure average speed within 6 measurements
function cacheItem(item) {
    cache[cache.offset++] = item;
    cache.offset %= cache.length;
}
function cacheGet(i) { // backwards, 0 is most recent
    return cache[(cache.offset - 1 - i + cache.length) % cache.length];
}