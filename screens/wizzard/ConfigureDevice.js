import React from "react";
import {
  StyleSheet,
  TextInput,
  Picker,
  View,
  ActivityIndicator
} from "react-native";

import { LocaleText } from "../../components/Texts";
import {
  ModalButtons,
  ModalHeader,
  ModalTooltip,
  ModalError
} from "../../components/Modals";
import { WifiRequests, ConfigRequests, Requests } from "../../common/request";
import { ActivityButton } from "../../components/Buttons";
import Settings from "../../common/settings";
import Locale from "../../common/locale";
import Wifi from "../../common/wifi";

const host = "192.168.4.1";

function retry(fn, retriesLeft = 3, interval = 10000) {
  return new Promise((resolve, reject) => {
    return fn()
      .then(resolve)
      .catch(error => {
        if (retriesLeft === 0) {
          reject(error);
          return;
        }
        setTimeout(() => {
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}

function getAuth({ password }) {
  return Requests.toAuth("admin", password);
}

function configureAuth({ password: devicePassword }) {
  const auth = getAuth({ password: devicePassword });

  return Settings.getCredentials().then(({ password, user }) => {
    let promise;
    if (user === undefined || user.length === 0) {
      promise = Settings.setCredentials({
        user: "admin",
        password: devicePassword
      });
    } else {
      promise = ConfigRequests.setAuth(
        host,
        {
          user: user,
          password: password
        },
        auth
      );
    }
    return promise;
  });
}

function configureWifi(props, { ssid, password }) {
  const auth = getAuth(props);
  return WifiRequests.setConfigSTA(host, { ssid: ssid, pass: password }, auth)
    .then(WifiRequests.setConfig(host, { mode: 3, restart: true }, auth))
    .catch(ignore => {})
    .then(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            const { ssid, password, type } = props;
            Wifi.connectSecure(ssid, password, type === "WEP", true, () => {
              Wifi.getGatewayIPAddress().then(ip => {
                if (ip === host) {
                  Wifi.forceWifiUsage(true);
                  resolve();
                } else {
                  reject();
                }
              });
            });
          }, 10000);
        })
    )
    .then(() =>
      retry(() => {
        return WifiRequests.getConfigSTA(host, auth).then(({ status }) => {
          if (!status) throw "Failed to connect to wifi";
        });
      })
    );
}

function restartDevice(props) {
  return WifiRequests.setConfig(
    host,
    { mode: 1, restart: true },
    getAuth(props)
  );
}

export default class ConfigureDevice extends React.Component {
  state = { configuring: false };

  onPasswordChange = v => {
    this.setState({ password: v });
  };
  onSsidChange = v => {
    this.setState({ ssid: v });
  };

  onError = (label, callback) => {
    this.setState(
      { configuring: false, errorMsg: Locale.getLabel(label) },
      callback
    );
  };

  getNetworks = callback => {
    this.setState({ errorMsg: undefined }, () => {
      WifiRequests.getNetworks(host, getAuth(this.props))
        .then(resp => this.setState(resp, callback))
        .catch(() => this.onError("wizzard.errors.networks", callback));
    });
  };

  configure = () => {
    const { onOk } = this.props;
    this.setState({ configuring: true, errorMsg: undefined }, () => {
      configureWifi(this.props, this.state)
        .then(() => {
          configureAuth(this.props)
            .then(() => {
              restartDevice(this.props).catch(() => {
                this.setState({ configuring: false }, onOk);
              });
            })
            .catch(() => this.onError("wizzard.errors.auth"));
        })
        .catch(() => this.onError("wizzard.errors.wifi"));
    });
  };

  render() {
    const { ssid: deviceSsid, onClose } = this.props;
    const { ssid, password, errorMsg, networks = [], configuring } = this.state;
    return (
      <>
        <ModalHeader label="wizzard.setup" deviceSsid={deviceSsid} />
        <ModalTooltip label="wizzard.tooltip.setup" />

        <LocaleText
          style={styles.sectionContentText}
          label="credentials.ssid"
        />
        <View
          style={[
            {
              display: "flex",
              flexDirection: "row",
              alignContent: "stretch",
              justifyContent: "space-between",
              alignItems: "center"
            },
            styles.sectionOffset
          ]}
        >
          <Picker
            style={{ flex: 1, marginRight: 20 }}
            onValueChange={this.onSsidChange}
            selectedValue={ssid}
            enabled={networks.length > 0}
          >
            {networks.map((m, i) => (
              <Picker.Item key={i} label={m} value={m} />
            ))}
          </Picker>
          <ActivityButton name="refresh" onPress={this.getNetworks} />
        </View>

        <LocaleText
          style={styles.sectionContentText}
          label="credentials.password"
        />
        <TextInput
          secureTextEntry={true}
          style={[styles.sectionContentInput, styles.sectionOffset]}
          value={password}
          onChangeText={this.onPasswordChange}
        />

        <ModalError errorMsg={errorMsg} />
        {configuring ? (
          <ActivityIndicator size="large" color="#009688" />
        ) : (
          <ModalButtons
            onClose={onClose}
            onPress={this.configure}
            disabled={ssid === undefined}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  sectionContentText: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold"
  },
  sectionContentInput: {
    color: "#808080",
    fontSize: 20,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: "#ededed"
  },
  sectionOffset: {
    marginBottom: 10
  }
});
