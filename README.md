# digitalofficemobile
Digital Office for mobile

## About Cordova
You need to install Cordova via npm

    npm install -g cordova

## How to Run
Navigate in the folder where you clone the project and add a platform.

    cordova platform add ios

Then build.

    cordova build ios

Then emulate iOS.

    cordova emulate ios

*Note: You should prepare iOS runtime before emulate iOS app!*

If you want to run this app in Android, you need to add Android platform, prepare for the environment then simply run this app.

## About Beacon
You need to include Beacon.js in util folder.

    /www/util/Beacon.js

When application starting, call method _Beacon.startBeaconRegion()_ to start ranging beacons.
Then call method _Beacon.getLocation()_ to get current Beacon _{major: xx, minor: xx}_