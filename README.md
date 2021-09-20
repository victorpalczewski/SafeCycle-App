# SafeCycle-App
A Cordova-based Progressive Web App (PWA) used for my capstone project

# Requirements
- Visual Studio 2017 or 2018 since Cordova is no longer available in recent versions
- Physical Android or IOS phone to deploy to
- "Mobile Development with JavaScript" extension for Visual Studio

![image](https://user-images.githubusercontent.com/65727335/134032099-11e75b15-4662-4e36-bce2-3f4bab5ea426.png)

# Build
- Make sure debbuging is set to the platform of your choice + "Device" at the top

![image](https://user-images.githubusercontent.com/65727335/134032688-23c742ae-c234-4806-a2f6-7f4707484daa.png)
- Any problems with deploying can likely be solved by reading the Cordova documentation: https://cordova.apache.org/docs/en/2.9.0/guide/getting-started/android/ https://cordova.apache.org/docs/en/3.1.0/guide/platforms/ios/
- Some external plugins may cause issues (in my case it was a third party geolocation plugin called "Mapbox"), in which case support is often outdated or not working. Build failures are usually the result of a bad plugin or unneeded tampering with the .config file for the app

# Features
## Home
- This app can communicate with an Arduino Nano via an HM10 BLE module or similar clone
- The Arduino will need to be set up to send/recieve serial messages at a speed no less than 9600 baud, otherwise issues may occur (many forums have simple serial code for the Arduino)
- The first page of the app is the Home page where 5 different buttons and a terminal log entry box is seen
- The purpose of the terminal box is for the user to quickly see what is going on inside the system. It reads any and all JS console messages that the system produces when running the app and it was mostly used to quickly debug while my group was testing the SafeCycle on the road and away from any computer that could see those messages

<img src="https://user-images.githubusercontent.com/65727335/134035208-43a6aabe-d2e3-4011-a519-78633634d8f7.png" width="275" height="500">

## GPS
- Next the GPS page which allows you to enter an address or the name of a place and after pressing the "Take me there" button, your phone will open a GPS app of your choice to navigate you to that destination
- Originally I had a built-in map where you caould stay in the SafeCycle app to navigate, but the plugin I was using (Mapbox) turned out to break my code and stopped me from deploying to my phone for about a week until I removed the plugin
- The GPS page is a sort of compromise since it still allows you to navigate to your destination just not within the app itself

<img src="https://user-images.githubusercontent.com/65727335/134036862-7445c0ad-aaa0-4197-8839-f8eadbdc62c5.png" width="275" height="500"> <img src="https://user-images.githubusercontent.com/65727335/134037086-98b25bf9-d878-450f-85c5-d572f9a7369c.png" width="275" height="500">

## Alarm / Security
-The alarm page controls the security system in the SafeCycle by sending a single char over BLE to the Arduino to toggle the system on or off. The user can also toggle the text notifications if they desire since you will receive a text every 1 minute with the GPS coordinates of your bicycle if it is being stolen/moved so it can be retrieved

<img src="https://user-images.githubusercontent.com/65727335/134037792-3be32a74-a93f-4c24-9289-e86e3b0c2fea.png" width="275" height="500">

## Speedometer
- The last page that was developed was the speedometer page which uses a Geolocation plugin that uses your phone's native gps module. This works as a 2-for-1 since BLE needs location to be on to connect to the Arduino (as well as phone Bluetooth)
- As the user moves with their phone (most likely on the SafeCycle), the Geolocation plugin will track the users' position every 0.5 seconds and it will calculate instantaneous and average speed over 6 speed measurements

<img src="https://user-images.githubusercontent.com/65727335/134038606-1122daf4-3f6b-4292-9e86-286a799acdd4.png" width="275" height="500">

## Bluetooth
- The main plugin that allowed for the use of BLE serial communication was the EvoThings BLE plugin: https://github.com/evothings/cordova-ble
- All of the code found in the scripts/bluetooth.js file was made possible by EvoThings
- A lot of the functions seen in that file were custom made and modified from existing EvoThings functions by myself to fit the functionality of Bluetooth for the SafeCycle

# Demo
- A short demo video of the SafeCycle app working can be found on my Google Drive: https://drive.google.com/file/d/1ijpZ0DvJiLylQ4QX6xren2GqswI5SX-l/view?usp=sharing
- A short demo of the speedometer can be found here: https://drive.google.com/file/d/1Z4PqcGDxpNZm7sYglmmdMrm3wMqfjPJ5/view?usp=sharing
- The speedometer tend to stop working reliably since it depends on the weather (clouds make it inaccurate) and on the strength of the users' phone GPS module
- In the demo for the speedometer above, that video was taken on a cloudy day and the GPS module in my phone was become inaccurate since it was a 5 year old phone at the time of recording

# To-Do
- Fix the average speed tracker in the speedometer page since time constraints prevented full development
- clean up JavaScript code for Bluetooth 
