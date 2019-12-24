import React from "react";
import { StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { Appearance } from "react-native-appearance";

import ConnectDevice from "./ConnectDevice";
import ConfigureDevice from "./ConfigureDevice";
import Wifi from "../../common/wifi";

export default class WizzardModal extends React.Component {
  state = { connectedToDevice: false };

  componentDidMount() {
    this.appearanceListener = Appearance.addChangeListener(({ colorScheme }) =>
      this.setState({ colorScheme: colorScheme })
    );
  }

  componentWillUnmount() {
    this.appearanceListener.remove();
  }

  onConnected = () => {
    this.setState({ connectedToDevice: true });
  };

  onConfigured = () => {
    const { ssid, onClose } = this.props;
    Wifi.removeSSID(ssid, true, error => {
      if (!error) onClose();
    });
  };

  render() {
    const { ssid: deviceSsid, onClose } = this.props;
    const {
      connectedToDevice = false,
      networks = [],
      colorScheme = Appearance.getColorScheme()
    } = this.state;
    return (
      <Modal
        isVisible={deviceSsid !== undefined}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        style={styles.container}
      >
        <View style={styles.centerContainer}>
          <View
            style={[
              styles.containerContent,
              colorScheme === "dark" ? { backgroundColor: "black" } : {}
            ]}
          >
            {!connectedToDevice ? (
              <ConnectDevice {...this.props} onOk={this.onConnected} />
            ) : (
              <ConfigureDevice
                {...this.props}
                onOk={this.onConfigured}
                networks={networks}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: { margin: 0, flex: 1 },
  centerContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch"
  },
  containerContent: {
    display: "flex",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ededed"
  }
});
