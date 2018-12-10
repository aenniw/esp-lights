import { AsyncStorage } from "react-native";
import { Requests, Mdns } from "./Common";

const Store = "";
const StorageKeys = {
  User: Store + "user",
  Passwd: Store + "pass",
  MDNS: Store + "mdns"
};

function getValue(key, callback) {
  AsyncStorage.getItem(key, (err, val) => {
    callback(JSON.parse(val));
  });
}

export default class Settings {
  static setUser(user) {
    AsyncStorage.setItem(StorageKeys.User, JSON.stringify(user));
    getValue(StorageKeys.Passwd, pass => {
      Requests.setAuth(user, pass);
    });
  }

  static getUser(callback) {
    getValue(StorageKeys.User, callback);
  }

  static setPass(pass) {
    AsyncStorage.setItem(StorageKeys.Passwd, JSON.stringify(pass));
    getValue(StorageKeys.User, user => {
      Requests.setAuth(user, pass);
    });
  }
  static getPass(callback) {
    getValue(StorageKeys.Passwd, callback);
  }

  static setMDNS(val) {
    Mdns.stop();
    Mdns.setMdns(val);
    Mdns.startScan();
    AsyncStorage.setItem(StorageKeys.MDNS, JSON.stringify(val));
  }
  static getMDNS(callback) {
    getValue(StorageKeys.MDNS, callback);
  }
}
