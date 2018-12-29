import base64 from "react-native-base64";
import Zeroconf from "react-native-zeroconf";

let auth = "",
  mdns = "",
  mdnsStarted = false;
const zeroconf = new Zeroconf();

export class Mdns {
  static setMdns(val = "") {
    mdns = val;
  }

  static startScan() {
    if (mdnsStarted) return;
    try {
      zeroconf.scan("arduino", "tcp", "local.");
    } catch (err) {
      console.warn(err);
    }
  }

  static start(found, removed) {
    const hosts = [];
    zeroconf.on("start", () => (mdnsStarted = true));
    zeroconf.on("stop", () => {
      hosts.forEach(host => removed(host));
      hosts.splice(0, hosts.length);
      mdnsStarted = false;
    });
    zeroconf.on("resolved", ({ host, name }) => {
      console.log("mdns + ", host, name);
      if (!mdns || mdns.length === 0 || name.indexOf(mdns) >= 0) {
        hosts.push(host);
        found(host);
      }
    });
    zeroconf.on("removed", ({ host, name }) => {
      console.log("mdns - ", host, name);
      if (!mdns || mdns.length === 0 || name.indexOf(mdns) >= 0) {
        hosts.slice(hosts.indexOf(host), 1);
        removed(host);
      }
    });
    Mdns.startScan();
  }

  static stop() {
    if (!mdnsStarted) return;
    console.log("scan stopped");
    try {
      zeroconf.stop();
    } catch (err) {
      console.warn(err);
    }
  }
}

export class Requests {
  static setAuth(user, pass) {
    auth = base64.encode(user + ":" + pass);
  }

  static get(host, path) {
    console.log("GET", host, path, auth);
    return fetch("http://" + host + "/" + path, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authentification: auth ? "Basic " + auth : undefined
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log("GET", host, path, "resp", json);
        return json;
      })
      .catch(error => {
        console.warn(error);
      });
  }

  static post(host, path, body) {
    console.log("POST", host, path, body, auth);
    return fetch("http://" + host + "/" + path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authentification: auth ? "Basic " + auth : undefined,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(json => {
        console.log("POST", host, path, "resp", json);
        return json;
      })
      .catch(error => {
        console.warn(error);
      });
  }
}

export class LightRequests {
  static getConfig(host) {
    return Requests.get(host, "led-strip/get-config");
  }
  static setAnimationMode(host, mode) {
    return Requests.post(host, "led-strip/set-mode", {
      mode: mode
    });
  }
  static setColor(host, color) {
    return Requests.post(host, "led-strip/set-color", {
      rgb: color
    });
  }
  static setSpeed(host, speed) {
    return Requests.post(host, "led-strip/set-speed", {
      speed: Math.round(speed)
    });
  }
  static setBrightness(host, brightness) {
    return Requests.post(host, "led-strip/set-brightness", {
      brightness: Math.round(brightness)
    });
  }

  static getAnimationColors(host) {
    return Requests.get(host, "led-strip/get-animation-colors");
  }
  static setAnimationColors(host, colors = []) {
    return Requests.post(host, "led-strip/set-animation-colors", {
      "animation-colors": colors
    });
  }
}
