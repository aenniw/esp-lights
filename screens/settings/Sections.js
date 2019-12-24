import React from "react";
import { StyleSheet, View, Switch, TextInput } from "react-native";
import { Updates } from "expo";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";

import { IconButton } from "../../components/Buttons";
import { LocaleText, StyledText } from "../../components/Texts";
import Settings from "../../common/settings";

const { manifest = {} } = Constants;

export class Version extends React.Component {
  state = { update: false };

  checkUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      this.setState({ update: update.isAvailable });
    } catch (e) {
      console.warn(e);
    }
  };

  update = async () => {
    try {
      await Updates.fetchUpdateAsync();
      Updates.reloadFromCache();
    } catch (e) {
      console.warn(e);
    }
  };

  render() {
    const { update } = this.state;
    return (
      <>
        <StyledText style={styles.sectionContentText}>
          {manifest.version}
        </StyledText>
        {update ? (
          <IconButton name="download" size={36} onPress={this.update} />
        ) : (
          <IconButton name="sync" size={36} onPress={this.checkUpdates} />
        )}
      </>
    );
  }
}

export class MdnsToggle extends React.PureComponent {
  state = {};

  componentDidMount() {
    Settings.onMDNS(v => this.setState(v));
  }

  onChange = v => {
    this.setState({ enabled: v }, () => {
      Settings.setMDNS({ enabled: v });
    });
  };

  render() {
    const { enabled = false } = this.state;
    return (
      <>
        <LocaleText style={styles.sectionContentText} label="mdns.enable" />
        <Switch value={enabled} onValueChange={this.onChange} />
      </>
    );
  }
}

export class MdnsFilter extends React.PureComponent {
  state = {};

  componentDidMount() {
    Settings.onMDNS(v => this.setState(v));
  }

  onChange = v => {
    this.setState({ filter: v }, () => {
      Settings.setMDNS({ filter: v });
    });
  };

  render() {
    const { filter = "", enabled = false } = this.state;
    return (
      <>
        <LocaleText style={styles.sectionContentText} label="mdns.filter" />
        <TextInput
          style={styles.sectionContentInput}
          value={filter}
          editable={!enabled}
          onChangeText={this.onChange}
        />
      </>
    );
  }
}

export class CredentialsUsername extends React.PureComponent {
  state = {};

  componentDidMount() {
    Settings.onCredentials(v => this.setState(v));
  }

  onChange = v => {
    this.setState({ user: v }, () => {
      Settings.setCredentials({ user: v });
    });
  };

  render() {
    const { user = "" } = this.state;
    return (
      <>
        <LocaleText
          style={styles.sectionContentText}
          label="credentials.user"
        />
        <TextInput
          style={styles.sectionContentInput}
          value={user}
          onChangeText={this.onChange}
        />
      </>
    );
  }
}

export class CredentialsPassword extends React.PureComponent {
  state = {};

  componentDidMount() {
    Settings.onCredentials(v => this.setState(v));
  }

  onChange = v => {
    this.setState({ password: v }, () => {
      Settings.setCredentials({ password: v });
    });
  };

  render() {
    const { password = "" } = this.state;
    return (
      <>
        <LocaleText
          style={styles.sectionContentText}
          label="credentials.password"
        />
        <TextInput
          style={styles.sectionContentInput}
          secureTextEntry={true}
          value={password}
          onChangeText={this.onChange}
        />
      </>
    );
  }
}

export function Device({ address, onPress }) {
  return (
    <View style={styles.listContentContainer}>
      <StyledText
        style={[styles.sectionContentText, { textDecorationLine: "underline" }]}
        onPress={() => WebBrowser.openBrowserAsync("http://" + address)}
      >
        {address}
      </StyledText>
      <IconButton name="remove" onPress={onPress} size={36} />
    </View>
  );
}

export class Devices extends React.PureComponent {
  state = {};

  componentDidMount() {
    Settings.onDevices(v => this.setState({ devices: v }));
  }

  removeDevice(index) {
    const { devices } = this.state;
    devices.splice(index, 1);
    Settings.setDevices(devices);
    this.forceUpdate();
  }

  render() {
    const { devices = [] } = this.state;
    return (
      <View style={styles.container}>
        {devices.map((item, i) => (
          <Device key={i} {...item} onPress={() => this.removeDevice(i)} />
        ))}
      </View>
    );
  }
}

export class NewDevice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.onChange = v => {
      this.setState({ device: v });
    };
    this.addDevice = () => {
      const { device = "" } = this.state;
      if (device === "") {
        return;
      }

      Settings.getDevices().then((v = []) => {
        if (v.filter(({ address }) => address === device).length === 0) {
          v.push({ address: device });
          Settings.setDevices(v);
          this.setState({ device: "" });
        }
      });
    };
  }

  render() {
    const { device = "" } = this.state;
    return (
      <>
        <LocaleText
          style={styles.sectionContentText}
          label="devices.hostname"
        />
        <View style={{ marginHorizontal: 10, flex: 1 }}>
          <TextInput
            style={styles.sectionContentInput}
            value={device}
            onChangeText={this.onChange}
          />
        </View>
        <IconButton name="add" onPress={this.addDevice} size={36} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionContentText: {
    color: "#808080",
    fontSize: 14,
    flex: 0.4
  },
  sectionContentInput: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    color: "#808080",
    borderWidth: 2,
    borderColor: "#ededed",
    fontSize: 14,
    flex: 0.6
  },
  listContentContainer: {
    paddingTop: 2,
    paddingBottom: 4,
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
    alignContent: "stretch",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
