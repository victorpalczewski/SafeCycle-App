var connectedAudio = new Audio('audio/tim.mp3');         //to let the user know if the arduino is connected
var disconnectedAudio = new Audio('audio/stinky.mp3');   //or if there was an error/disconnect
var bluetoothEnabled = false;
var lightToggle = false;
var service;
var characteristic;
var Arduino;

(function () {
    var old = console.log;
    var logger = document.getElementById('terminal');
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    }
})();

document.getElementById("bluebutt").addEventListener("click", function () {
    evothings.ble.stopScan()
    findDevice();
});

document.getElementById("lightbutt").addEventListener("click", function () {

    if (bluetoothEnabled == false) {
        function alertDismissed() {
            // do something
        }

        navigator.notification.alert(
            'Please connect to the Arduino First',  // message
            alertDismissed,         // callback
            'ERROR',    // title
            'OK'                  // buttonName
        );
    }
    if (bluetoothEnabled == true) {
        if (lightToggle == false) {
            lightToggle = true;
            //send data to turn ON lights
            writeToArduino(65)  //write "A"

            console.log('Lights: ON\n')
        } else if (lightToggle == true) {
            lightToggle = false;
            //send data to turn OFF the lights
            writeToArduino(65)  //write "A"
            console.log('Lights: OFF\n')
        }

    }
});

document.getElementById("refreshbutt").addEventListener("click", function () {
    window.location = "index.html"    //reload the app
});
//*********************BLUETOOTH FUNCTIONS*********************************
function findDevice() {
    console.log('Started scanning')

    // Start scanning. Two callback functions are specified.
    evothings.ble.startScan(
        onDeviceFound,
        onScanError)

    // This function is called when a device is detected, here
    // we check if we found the device we are looking for.
    function onDeviceFound(device) {
        console.log('Found device: ' + device.advertisementData.kCBAdvDataLocalName)
        Arduino = device;
        if (device.advertisementData.kCBAdvDataLocalName == 'SafeCycle') {
            console.log('Found the Arduino!')

            // Stop scanning.
            evothings.ble.stopScan()

            // Connect.
            connectToDevice(device)

            connectedAudio.play()   //tim allen = good
        }
    }

    // Function called when a scan error occurs.
    function onScanError(error) {
        console.log('Scan error: ' + error)
    }
}

function connectToDevice(device) {
    evothings.ble.connectToDevice(
        device,
        onConnected,
        onDisconnected,
        onConnectError)

    function onConnected(device) {
        console.log('Connected to device')

        service = evothings.ble.getService(device, '0000ffe0-0000-1000-8000-00805f9b34fb')//service UUID for TX/RX
        characteristic = evothings.ble.getCharacteristic(service, '0000ffe1-0000-1000-8000-00805f9b34fb')//TX/RX characteristic
        //Start looking for RX/TX service UUIDs on the Arduino

        onArduinoActivate(device, service, characteristic);


    }

    // Function called if the device disconnects.
    function onDisconnected(error) {
        console.log('Device disconnected')
        disconnectedAudio.play()
    }

    // Function called when a connect error occurs.
    function onConnectError(error) {
        console.log('Connect error: ' + error)
        disconnectedAudio.play();
    }
}

function onArduinoActivate(device, service, characteristic) {   //for reading from arduino

    console.log('Arduino is ON');
    bluetoothEnabled = true;
    evothings.ble.enableNotification(
        device,
        characteristic,
        onTXNotification,
        onTXNotificationError)
}
function onTXNotification(data) {
    var nanoRead = new DataView(data).getString(0);
    console.log('Message received: ' + nanoRead)
}
function onTXNotificationError(error) {
    console.log('Arduino notification error: ' + error);
}


//********ALARM PAGE FUNCTIONS************************

document.getElementById("disarmed").addEventListener("click", function () {
    if (bluetoothEnabled == false) {    //check if ble connected before trying to arm the alarm
        function alertDismissed() {
            // do something
        }

        navigator.notification.alert(
            'Please connect to the Arduino First',  // message
            alertDismissed,         // callback
            'ERROR',    // title
            'OK'                  // buttonName
        );
    }
    if (bluetoothEnabled == true) {
        document.getElementById("disarmed").style.opacity = "1.0"
        document.getElementById("armed").style.opacity = "0.3"
        //writeToArduino to disarm the alarm system (default off)
        writeToArduino(68)  //write "D"
    }
});

document.getElementById("armed").addEventListener("click", function () {
    if (bluetoothEnabled == false) {    //check if ble connected before trying to arm the alarm
        function alertDismissed() {
            // do something
        }

        navigator.notification.alert(
            'Please connect to the Arduino First',  // message
            alertDismissed,         // callback
            'ERROR',    // title
            'OK'                  // buttonName
        );
    }
    if (bluetoothEnabled == true) {
        document.getElementById("disarmed").style.opacity = "0.3"
        document.getElementById("armed").style.opacity = "1.0"
        //writeToArduino to arm the alarm system (default off)
        writeToArduino(67)  //write "C"
    }

});

document.getElementById("bell").addEventListener("click", function () {
    if (bluetoothEnabled == false) {    //check if ble connected before trying to arm the alarm
        function alertDismissed() {
            // do something
        }

        navigator.notification.alert(
            'Please connect to the Arduino First',  // message
            alertDismissed,         // callback
            'ERROR',    // title
            'OK'                  // buttonName
        );
    }
    if (bluetoothEnabled == true) {
        //writeToArduino to ring the bell
        writeToArduino(66)  //write "B"
    }

});

document.getElementById("power").addEventListener("click", function () {
    if (bluetoothEnabled == false) {    //check if ble connected before trying to arm the alarm
        function alertDismissed() {
            // do something
        }

        navigator.notification.alert(
            'Please connect to the Arduino First',  // message
            alertDismissed,         // callback
            'ERROR',    // title
            'OK'                  // buttonName
        );
    }
    if (bluetoothEnabled == true) {
        //writeToArduino to turn the arduino OFF
        writeToArduino(69)  //write "E"
    }

});

function writeToArduino(dataWrite) {    //used to write data to arduino to switch something on/off
    var nanoWrite = new Uint8Array([dataWrite]);  //f=102 in ASCII so any char sent over to the arduino needs to be in this decimal format
    evothings.ble.writeCharacteristic(
        Arduino,
        characteristic,
        nanoWrite,
        function () {
            console.log('characteristic written: ' + nanoWrite);
        },
        function (errorCode) {
            console.log('writeCharacteristic error: ' + errorCode);
        }
    );
}