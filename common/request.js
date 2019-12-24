import base64 from "react-native-base64";
import Settings from "./settings";

let globalAuth = "";

export class Requests {
  static toAuth(user, pass) {
    return base64.encode(user + ":" + pass);
  }

  static setAuth(user, pass) {
    globalAuth = Requests.toAuth(user, pass);
  }

  static get(host, path, auth = globalAuth) {
    console.log("GET", host, path, auth);
    return fetch("http://" + host + "/" + path, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth ? "Basic " + auth : undefined
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log("GET", host, path, "resp", json);
        return json;
      });
  }

  static post(host, path, body, auth = globalAuth) {
    console.log("POST", host, path, body, auth);
    return fetch("http://" + host + "/" + path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: auth ? "Basic " + auth : undefined,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(json => {
        console.log("POST", host, path, "resp", json);
        return json;
      });
  }
}

function validate({ result }) {
  if (!result) throw "Request execution failed";
}

export class LightRequests {
  static getConfig(host) {
    return Requests.get(host, "led-strip/get-config");
  }
  static setAnimationMode(host, mode) {
    return Requests.post(host, "led-strip/set-mode", {
      mode: Number(mode)
    }).then(validate);
  }
  static setColor(host, color) {
    return Requests.post(host, "led-strip/set-color", {
      rgb: color
    }).then(validate);
  }
  static setSpeed(host, speed) {
    return Requests.post(host, "led-strip/set-speed", {
      speed: Math.round(speed)
    }).then(validate);
  }
  static setBrightness(host, brightness) {
    return Requests.post(host, "led-strip/set-brightness", {
      brightness: Math.round(brightness)
    }).then(validate);
  }

  static getAnimationColors(host) {
    return Requests.get(host, "led-strip/get-animation-colors");
  }
  static setAnimationColors(host, colors = []) {
    return Requests.post(host, "led-strip/set-animation-colors", {
      "animation-colors": colors
    }).then(validate);
  }
}

export class ConfigRequests {
  static setAuth(host, { user, password = "" }, auth) {
    const config = {};
    config["rest-acc"] = user;
    config["rest-pass"] = password;
    return Requests.post(host, "set-config-global", config, auth).then(
      validate
    );
  }

  static restart(host, auth) {
    return Requests.post(host, "restart", {}, auth).then(validate);
  }
}

export class WifiRequests {
  static getNetworks(host, auth) {
    return Requests.get(host, "get-networks", auth);
  }

  static getConfig(host, auth) {
    return Requests.get(host, "get-config-wifi", auth);
  }

  static setConfig(host, config, auth) {
    return Requests.post(host, "set-config-wifi", config, auth).then(validate);
  }

  static getConfigSTA(host, auth) {
    return Requests.get(host, "get-config-wifi-sta", auth);
  }

  static setConfigSTA(host, config, auth) {
    return Requests.post(host, "set-config-wifi-sta", config, auth).then(
      validate
    );
  }

  static getConfigAP(host, auth) {
    return Requests.get(host, "get-config-wifi-ap", auth);
  }

  static setConfigAP(host, config, auth) {
    return Requests.post(host, "set-config-wifi-ap", config, auth).then(
      validate
    );
  }
}

Settings.onCredentials(({ user, password }) =>
  Requests.setAuth(user, password)
);
