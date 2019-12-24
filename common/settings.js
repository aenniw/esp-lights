import { AsyncStorage } from "react-native";
import Constants from "expo-constants";

const Store = Constants.manifest.slug + "-";
const StorageKeys = {
  CREDENTIALS: Store + "credentials",
  DEVICES: Store + "devices",
  MDNS: Store + "mdns"
};
const callbacks = {};

function getValue(key, fallback = "{}") {
  return new Promise(resolve => {
    AsyncStorage.getItem(key, (err, val) => {
      resolve(JSON.parse(!val ? fallback : val));
    });
  });
}

function addListener(key, callback) {
  if (!callbacks[key]) {
    callbacks[key] = [];
  }
  callbacks[key].push(callback);

  return () => {
    const index = callbacks[key].indexOf(callback);
    if (index >= 0) {
      callbacks[key].splice(index, 1);
    }
  };
}

function getListeners(key) {
  return !callbacks[key] ? [] : callbacks[key];
}

export default class Settings {
  static setCredentials(val = {}) {
    return new Promise(resolve => {
      Settings.getCredentials().then((credentials = {}) => {
        val = Object.assign(credentials, val);

        AsyncStorage.setItem(StorageKeys.CREDENTIALS, JSON.stringify(val)).then(
          () => {
            getListeners(StorageKeys.CREDENTIALS).forEach(c => c(val));
            resolve();
          }
        );
      });
    });
  }

  static getCredentials() {
    return getValue(StorageKeys.CREDENTIALS);
  }

  static onCredentials(callback) {
    Settings.getCredentials().then(callback);
    return addListener(StorageKeys.CREDENTIALS, callback);
  }

  static setMDNS(val = {}) {
    return new Promise(resolve => {
      Settings.getMDNS().then((mdns = {}) => {
        val = Object.assign(mdns, val);

        AsyncStorage.setItem(StorageKeys.MDNS, JSON.stringify(val)).then(v => {
          getListeners(StorageKeys.MDNS).forEach(c => c(val));
          resolve();
        });
      });
    });
  }

  static getMDNS() {
    return getValue(StorageKeys.MDNS);
  }

  static onMDNS(callback) {
    Settings.getMDNS().then(callback);
    return addListener(StorageKeys.MDNS, callback);
  }

  static setDevices(val = []) {
    return new Promise(resolve => {
      AsyncStorage.setItem(StorageKeys.DEVICES, JSON.stringify(val)).then(v => {
        getListeners(StorageKeys.DEVICES).forEach(c => c(val));
        resolve();
      });
    });
  }

  static getDevices() {
    return getValue(StorageKeys.DEVICES, "[]");
  }

  static onDevices(callback) {
    Settings.getDevices().then(callback);
    return addListener(StorageKeys.DEVICES, callback);
  }
}
