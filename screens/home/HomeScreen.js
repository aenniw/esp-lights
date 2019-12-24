import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Appearance } from "react-native-appearance";

import WifiManager from "../../common/wifi";
import MultiSelect from "../../components/MultiSelect";
import Settings from "../../common/settings";
import Mdns from "../../common/mdns";
import Locale from "../../common/locale";
import Device from "./Device";
import { NoDevices, NoWifi } from "./Warnings";

const onSelecteDevices = [];

class DeviceSelect extends React.Component {
  state = { devices: [], mdns: [], selectedDevices: [], wifiEnabled: false };

  componentDidMount() {
    Settings.onDevices(devices => {
      this.setState({ devices: devices.map(d => d.address) });
    });

    Mdns.onAdd(device => {
      this.setState(({ mdns }, props) => {
        const devices = mdns.slice();
        devices.push(device);
        return { mdns: devices };
      });
    });
    Mdns.onRemove(device => {
      this.setState(({ mdns }, props) => {
        const devices = mdns.slice();
        devices.splice(devices.indexOf(device), 1);
        return { mdns: devices };
      });
    });

    this.wifiListener = WifiManager.getConnectionInfo(connected =>
      this.setState({ wifiEnabled: connected })
    );
  }

  setSelected = devices => {
    this.setState({ selectedDevices: devices }, () =>
      onSelecteDevices.forEach(c => c(devices))
    );
  };

  componentWillUnmount() {
    this.wifiListener();
  }

  render() {
    const {
      mdns = [],
      devices = [],
      selectedDevices = [],
      wifiEnabled = false
    } = this.state;

    return (
      <MultiSelect
        options={[...new Set(devices.slice().concat(mdns))]}
        disabled={!wifiEnabled}
        selected={selectedDevices}
        onSelectedChanged={this.setSelected}
        allLabel={Locale.getLabel("common.all")}
        noneLabel={Locale.getLabel("devices.none")}
        selectLabel={Locale.getLabel("devices.select")}
      />
    );
  }
}

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: () => <DeviceSelect />
  };
  state = { devices: [] };

  componentDidMount() {
    onSelecteDevices.push(devices => {
      this.setState({ devices: devices });
    });
    this.wifiListener = WifiManager.getConnectionInfo(connected =>
      this.setState({ wifiEnabled: connected })
    );
    this.appearanceListener = Appearance.addChangeListener(({ colorScheme }) =>
      this.setState({ colorScheme: colorScheme })
    );
  }

  componentWillUnmount() {
    this.wifiListener();
    onSelecteDevices.splice(0, onSelecteDevices.length);
    this.appearanceListener.remove();
  }

  render() {
    const {
      devices = [],
      wifiEnabled = false,
      noDevices = devices.length === 0,
      colorScheme = Appearance.getColorScheme()
    } = this.state;
    return (
      <ScrollView
        style={[
          styles.container,
          colorScheme === "dark" ? { backgroundColor: "black" } : {}
        ]}
        contentContainerStyle={
          !wifiEnabled || noDevices ? styles.contentContainer : {}
        }
      >
        {!wifiEnabled && <NoWifi />}
        {wifiEnabled && noDevices && <NoDevices />}
        {wifiEnabled && !noDevices && <Device devices={devices} />}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingTop: 30,
    flex: 1
  }
});
