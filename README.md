# esp-mdns-lights [![Build Status](https://travis-ci.org/aenniw/esp-mdns-lights.svg?branch=master)](https://travis-ci.org/aenniw/esp-mdns-lights)

Android App for discover/controll ESP8226 lights

# Eject && link deps

```bash
npm eject
react-native link react-native-zeroconf
react-native link react-native-code-push
```

# Build

```bash
    cd android && \
        ./gradlew clean && \
        ./gradlew assembleDebug && \
        cd -
```

## Preview

[Expo Snack](https://snack.expo.io/@git/github.com/aenniw/esp-mdns-lights@develop)

## Develop

```bash
sudo adb reverse tcp:8081 tcp:8081
```

## Deploys

```bash
npm run deploy              # deploy current build to prod
npm run deployments         # show active deployments
npm run deployment-keys     # retrieve deployment keys
```

Upon deployment key change update [strings.xml](./android/app/src/main/res/values/strings.xml) as bellow

```xml
<resources>
    <string moduleConfig="true" name="reactNativeCodePush_androidDeploymentKey">deployment key/string>
    <string name="app_name">espmdnslights</string>
</resources>
```

### Assets - Icons

[AndroidAssetStudio](http://romannurik.github.io/AndroidAssetStudio/index.html)
