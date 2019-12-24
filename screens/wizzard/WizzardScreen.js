import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import WizzardModal from "./WizzardModal";

import { IconButton } from "../../components/Buttons";
import { MonoText, LocaleText } from "../../components/Texts";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: () => (
      <MonoText
        label="wizzard.label"
        style={{
          fontSize: 18,
          paddingHorizontal: 20
        }}
      />
    )
  };

  state = {
    cameraPermission: Permissions.PermissionStatus.UNDETERMINED,
    scanned: true
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ cameraPermission: status });
  };

  handleBarCodeScanned = ({ data }) => {
    const match = data.match("WIFI:S:(.*);T:(WPA|WEP);P:(.*);;");
    if (match) {
      this.setState({ ssid: match[1], type: match[2], password: match[3] });
    }
    this.setState({ scanned: true });
  };

  reScan = () => {
    this.setState(
      {
        ssid: undefined,
        type: undefined,
        password: undefined,
        scanned: false
      },
      () => {
        if (Platform.OS === "web") {
          this.handleBarCodeScanned({ data: "WIFI:S:SSID;T:WPA;P:password;;" });
        }
      }
    );
  };

  clearScan = () => {
    this.setState({
      ssid: undefined,
      type: undefined,
      password: undefined
    });
  };

  render() {
    const { cameraPermission, scanned, ssid, type, password } = this.state;

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.containerContent,
            {
              backgroundColor:
                cameraPermission === Permissions.PermissionStatus.GRANTED
                  ? "black"
                  : "lightgray"
            }
          ]}
        >
          {cameraPermission === Permissions.PermissionStatus.UNDETERMINED && (
            <LocaleText
              style={styles.sectionWarning}
              label="camera.permission"
            />
          )}
          {cameraPermission === Permissions.PermissionStatus.GRANTED && (
            <BarCodeScanner
              style={StyleSheet.absoluteFillObject}
              barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
              onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            />
          )}
          {cameraPermission === Permissions.PermissionStatus.DENIED && (
            <LocaleText style={styles.sectionWarning} label="camera.none" />
          )}
        </View>
        <View style={styles.scanButton}>
          <IconButton
            style={{ borderRadius: 20, position: "absolute", bottom: 30 }}
            name="qr-scanner"
            size={50}
            onPress={this.reScan}
          />
        </View>
        {ssid && (
          <WizzardModal
            ssid={ssid}
            type={type}
            password={password}
            onClose={this.clearScan}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerContent: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  scanButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  sectionWarning: {
    fontSize: 20,
    fontFamily: "space-mono",
    textAlign: "center",
    paddingHorizontal: 15
  }
});
