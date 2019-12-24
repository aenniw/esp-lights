import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { LocaleText } from "../../components/Texts";

export function NoWifi() {
  return (
    <View style={styles.container}>
      <Image
        source={
          __DEV__
            ? require("../../assets/images/robot-dev.png")
            : require("../../assets/images/robot-prod.png")
        }
        style={styles.image}
      />
      <LocaleText style={styles.text} label="common.nowifi" />
    </View>
  );
}

export function NoDevices() {
  return (
    <View style={styles.container}>
      <Image
        source={
          __DEV__
            ? require("../../assets/images/robot-dev.png")
            : require("../../assets/images/robot-prod.png")
        }
        style={styles.image}
      />
      <LocaleText style={styles.text} label="devices.unselected" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10,
    marginBottom: 20
  },
  text: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    fontFamily: "space-mono",
    lineHeight: 24,
    textAlign: "center"
  }
});
