import React from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { Appearance } from "react-native-appearance";

import ApplicationInfo from "./ApplicationInfo";
import { MonoText, LocaleText } from "../../components/Texts";
import {
  CredentialsPassword,
  CredentialsUsername,
  Devices,
  MdnsFilter,
  MdnsToggle,
  NewDevice,
  Version
} from "./Sections";

function section(title, data = []) {
  return { title: title, data: data };
}

export default class ConfigSectionList extends React.Component {
  static navigationOptions = {
    headerTitle: () => (
      <MonoText
        label="common.settings"
        style={{ fontSize: 18, paddingHorizontal: 20 }}
      />
    )
  };

  state = {};

  componentDidMount() {
    this.appearanceListener = Appearance.addChangeListener(({ colorScheme }) =>
      this.setState({ colorScheme: colorScheme })
    );
  }

  componentWillUnmount() {
    this.appearanceListener.remove();
  }

  render() {
    const { colorScheme = Appearance.getColorScheme() } = this.state;
    return (
      <SectionList
        style={[
          styles.container,
          colorScheme === "dark" ? { backgroundColor: "black" } : {}
        ]}
        sections={[
          section("common.version", [<Version />]),
          section("mdns.label", [<MdnsToggle />, <MdnsFilter />]),
          section("credentials.label", [
            <CredentialsUsername />,
            <CredentialsPassword />
          ]),
          section("devices.label", [<NewDevice />, <Devices />])
        ]}
        ListHeaderComponent={ApplicationInfo}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View style={styles.sectionContentContainer}>{item}</View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={[
              styles.sectionHeaderContainer,
              colorScheme === "dark" ? { backgroundColor: "#272727" } : {}
            ]}
          >
            <LocaleText style={styles.sectionHeaderText} label={title} />
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionHeaderContainer: {
    backgroundColor: "#fbfbfb",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ededed"
  },
  sectionHeaderText: {
    fontFamily: "space-mono",
    fontSize: 14
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
