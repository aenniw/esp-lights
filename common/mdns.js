import Zeroconf from "react-native-zeroconf";
import isIp from "is-ip";

import Settings from "./settings";

let mdnsFilter = "",
  mdnsStarted = false,
  hosts = [],
  onAdd = [],
  onRemove = [];
const zeroconf = new Zeroconf();

function unregister(listener, listeners) {
  const index = listeners.indexOf(listener);
  if (index >= 0) {
    listeners.splice(index, 1);
  }
}

export default class Mdns {
  static onAdd(listener) {
    onAdd.push(listener);
    return () => unregister(listener, onAdd);
  }

  static onRemove(listener) {
    onRemove.push(listener);
    return () => unregister(listener, onRemove);
  }

  static start() {
    if (mdnsStarted) return;

    zeroconf.on("start", () => (mdnsStarted = true));
    zeroconf.on("stop", () => {
      onRemove.forEach(c => hosts.forEach(host => c(host)));
      hosts.splice(0, hosts.length);
      mdnsStarted = false;
    });

    zeroconf.on("resolved", ({ host, name }) => {
      console.log("mdns - resolved -", host, name, mdnsFilter);

      if (
        (!mdnsFilter ||
          mdnsFilter.length === 0 ||
          host.indexOf(mdnsFilter) >= 0) &&
        hosts.indexOf(host) < 0 &&
        !isIp(host)
      ) {
        hosts.push(host);
        onAdd.forEach(c => c(host));
      }
    });
    zeroconf.on("removed", ({ host, name }) => {
      console.log("mdns - removed -", host, name);

      if (
        !mdnsFilter ||
        mdnsFilter.length === 0 ||
        host.indexOf(mdnsFilter) >= 0
      ) {
        hosts.slice(hosts.indexOf(host), 1);
        onRemove.forEach(c => c(host));
      }
    });

    try {
      console.log("start zeroconf");
      zeroconf.scan("arduino", "tcp", "local.");
    } catch (err) {
      console.warn(err);
    }
  }

  static stop() {
    console.log("stop zeroconf");
    if (!mdnsStarted) return;
    try {
      zeroconf.stop();
    } catch (err) {
      console.warn(err);
    }
  }
}

Settings.onMDNS(({ filter, enabled }) => {
  mdnsFilter = filter;
  if (enabled) {
    Mdns.start();
  } else {
    Mdns.stop();
  }
});
