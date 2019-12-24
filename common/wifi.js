import { Platform } from "react-native";
import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";

function getRandomBool() {
  return Math.floor(Math.random() * Math.floor(5)) > 1;
}

let Wifi = {
  removeSSID: (ssid, force, callback) => {
    callback(getRandomBool());
  },
  forceWifiUsage: () => {},
  connectSecure: (ssid, pwd, type, force, callback) => {
    callback(getRandomBool());
  }
};

let NetworkInfo = {
  getGatewayIPAddress: () => {
    return {
      then: callback => {
        callback("192.168.4.1");
      }
    };
  }
};

try {
  Wifi = require("@josectobar/react-native-iot-wifi");
  NetworkInfo = require("react-native-network-info").NetworkInfo;
} catch (e) {
  console.warn(e);
}

function getWifiStatus({ type, isConnected }) {
  return isConnected && type === NetInfoStateType.wifi;
}

Wifi.getGatewayIPAddress = NetworkInfo.getGatewayIPAddress;
Wifi.getConnectionInfo = callback => {
  if (Platform.OS === "web") {
    callback(getRandomBool());
    return () => {};
  }
  return NetInfo.addEventListener(info => {
    callback(getWifiStatus(info));
  });
};

export default Wifi;
