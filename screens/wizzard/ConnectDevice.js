import React from "react";
import { ActivityIndicator } from "react-native";

import {
  ModalButtons,
  ModalHeader,
  ModalTooltip,
  ModalError
} from "../../components/Modals";
import Wifi from "../../common/wifi";
import Locale from "../../common/locale";

export default class ConnectDevice extends React.Component {
  state = { connecting: false };

  onConnect = () => {
    const { onOk, ssid } = this.props;
    Wifi.getGatewayIPAddress().then(ip => {
      if (ip === "192.168.4.1") {
        Wifi.forceWifiUsage(true);
        this.setState({ connecting: false }, onOk);
      } else {
        this.setState({
          connecting: false,
          errorMsg: Locale.getLabel("wizzard.errors.connection", {
            device: ssid
          })
        });
      }
    });
  };

  connect = () => {
    this.setState({ connecting: true }, () => {
      const { ssid, password, type } = this.props;
      Wifi.connectSecure(ssid, password, type === "WEP", true, this.onConnect);
    });
  };

  render() {
    const { ssid, onClose } = this.props;
    const { errorMsg, connecting } = this.state;
    return (
      <>
        <ModalHeader label="wizzard.connect" deviceSsid={ssid} />
        <ModalTooltip label="wizzard.tooltip.connect" />
        <ModalError errorMsg={errorMsg} />
        {connecting ? (
          <ActivityIndicator size="large" color="#009688" />
        ) : (
          <ModalButtons onClose={onClose} onPress={this.connect} />
        )}
      </>
    );
  }
}
