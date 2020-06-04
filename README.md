# esp-lights ![Expo build](https://github.com/aenniw/esp-lights/workflows/Expo%20build/badge.svg?branch=develop) [![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-000.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

Android App for setup/discover/controll ESP8226 lights

## Preview

[Expo Snack](https://snack.expo.io/@git/github.com/aenniw/esp-mdns-lights@develop)

```bash
npm start   # With expo App
npm run web # Standalone in browser
```

## Eject && Link deps && Build

```bash
npm run eject && \
npm run link && \
npm run build
```

- refresh adb

```bash
sudo adb reverse tcp:8081 tcp:8081
```

## Deploys/OTA

- managed via `expo export --public-url` and github pages deployments

### Assets - Icons

- https://ionicons.com/
- [AndroidAssetStudio](http://romannurik.github.io/AndroidAssetStudio/index.html)
