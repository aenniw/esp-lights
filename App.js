import * as React from "react";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  Picker,
  Dimensions,
  Button,
  StatusBar
} from "react-native";
import { Card } from "react-native-paper";
import Device from "./components/screens/Device";
import Settings from "./components/screens/Settings";
import { Mdns, Requests } from "./components/common/Common";
import SettingsStore from "./components/common/Settings";
import Locale from "./components/common/Locale";
import codePush from "react-native-code-push";

const Tabs = { Device: "device", Settings: "settings" };
const Window = Dimensions.get("window");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.setDevice = d => this.setState({ device: d });
    this.addDevice = d => {
      this.setState(({ devices = [], device }) => {
        if (devices.filter(device => device === d).length === 0) {
          devices.push(d);
        }
        if (!device) {
          device = d;
        }
        console.log(d, device);
        return { devices: devices, device: device };
      });
    };
    this.removeDevice = d => {
      this.setState(({ devices = [], device }) => {
        const index = devices.indexOf(d);
        if (index >= 0) {
          devices.splice(index, 1);
        }
        return { devices: devices, device: device === d ? undefined : device };
      });
    };
  }

  componentWillMount() {
    try {
      codePush.notifyAppReady();
    } catch (err) {
      console.warn(err);
    }
    SettingsStore.getMDNS(mdns => {
      Mdns.setMdns(mdns);
      Mdns.start(this.addDevice, this.removeDevice);
    });
    SettingsStore.getUser(user => {
      SettingsStore.getPass(pass => {
        Requests.setAuth(user, pass);
      });
    });
    if (__DEV__) this.addDevice("nop-device");
  }

  componentWillUnmount() {
    Mdns.stop();
  }

  setTab(itemValue) {
    this.setState({ tab: itemValue });
  }

  render() {
    const { devices = [], tab = Tabs.Device, device } = this.state;
    return (
      <ScrollView style={styles.container}>
        <Card style={styles.header}>
          {tab === Tabs.Device && (
            <Picker onValueChange={this.setDevice} selectedValue={device}>
              {devices.map((d, i) => (
                <Picker.Item key={i} label={d} value={d} />
              ))}
            </Picker>
          )}
          {tab === Tabs.Settings && (
            <Text
              style={{
                textAlign: "center",
                fontSize: 24,
                paddingTop: (barHeight - 24) / 3
              }}
            >
              {Locale.getLabel("settings")}
            </Text>
          )}
        </Card>

        <Card style={styles.content}>
          {tab === Tabs.Device && <Device device={device} />}
          {tab === Tabs.Settings && <Settings />}
        </Card>

        <View style={styles.footer}>
          {tab === Tabs.Device && (
            <Button
              title={Locale.getLabel("settings")}
              onPress={() => this.setTab(Tabs.Settings)}
            />
          )}
          {tab !== Tabs.Device && (
            <Button
              title={Locale.getLabel("done")}
              onPress={() => this.setTab(Tabs.Device)}
            />
          )}
        </View>
      </ScrollView>
    );
  }
}

const offsets = 10,
  barHeight = 50;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Window.width,
    marginTop: StatusBar.currentHeight,
    backgroundColor: "#ecf0f1",
    padding: 8
  },
  header: {
    marginBottom: offsets,
    height: barHeight,
    lineHeight: barHeight
  },
  content: {
    minHeight: Window.height - 2 * barHeight - 3 * offsets
  },
  footer: {
    height: barHeight,
    marginTop: offsets,
    marginBottom: offsets
  }
});
