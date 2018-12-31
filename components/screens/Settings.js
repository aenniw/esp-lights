import * as React from "react";
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import Settings from "../common/Settings";
import Locale from "../common/Locale";
import codePush from "react-native-code-push";

function Option({ label, value, onChange, secure = false }) {
  return (
    <View style={styles.option}>
      <Text style={styles.optionName}>{label}</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChange}
        value={value}
        secureTextEntry={secure}
      />
    </View>
  );
}

export default class SettingsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.setUser = v => this.setState({ user: v });
    this.setPass = v => this.setState({ pass: v });
    this.setMDNS = v => this.setState({ mdns: v });

    this.persistMDNS = v => {
      this.setMDNS(v);
      Settings.setMDNS(v);
    };
    this.persistUser = v => {
      this.setUser(v);
      Settings.setUser(v);
    };
    this.persistPass = v => {
      this.setPass(v);
      Settings.setPass(v);
    };
    this.checkUpdates = () => {
      try {
        codePush.sync({
          updateDialog: true,
          installMode: codePush.InstallMode.IMMEDIATE
        });
      } catch (err) {
        console.warn(err);
      }
    };
  }

  componentDidMount() {
    Settings.getMDNS(this.setMDNS);
    Settings.getUser(this.setUser);
    Settings.getPass(this.setPass);
  }

  render() {
    const { mdns, user, pass } = this.state;
    return (
      <View style={styles.container}>
        <Option
          label={Locale.getLabel("mdns")}
          onChange={this.persistMDNS}
          value={mdns}
        />
        <Option
          label={Locale.getLabel("user")}
          onChange={this.persistUser}
          value={user}
        />
        <Option
          label={Locale.getLabel("password")}
          onChange={this.persistPass}
          value={pass}
          secure={true}
        />
        <View style={styles.button}>
          <Button
            title={Locale.getLabel("update")}
            onPress={this.checkUpdates}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  option: {
    padding: 8,
    paddingTop: 0,
    paddingBottom: 20,
    width: "100%"
  },
  optionName: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
    textDecorationLine: "underline"
  },
  input: {
    fontSize: 16,
    textAlign: "center",
    padding: 4,
    borderWidth: 0.5,
    borderColor: "black"
  },
  button: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end"
  }
});
