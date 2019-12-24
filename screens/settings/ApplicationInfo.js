import Constants from "expo-constants";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Appearance } from "react-native-appearance";

import { StyledText } from "../../components/Texts";

export default function ApplicationInfo() {
  const { manifest } = Constants;

  return (
    <View
      style={[
        styles.titleContainer,
        Appearance.getColorScheme() === "dark"
          ? { backgroundColor: "black" }
          : {}
      ]}
    >
      <View style={styles.titleIconContainer}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={{ width: 64, height: 64 }}
          resizeMode="cover"
        />
      </View>

      <View>
        <StyledText style={styles.nameText} numberOfLines={1}>
          {manifest.name}
        </StyledText>

        <StyledText style={styles.slugText} numberOfLines={1}>
          {manifest.slug}
        </StyledText>

        <StyledText style={styles.descriptionText}>
          {manifest.description}
        </StyledText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: "row"
  },
  titleIconContainer: {
    marginRight: 15,
    paddingTop: 2,
    backgroundColor: "white"
  },
  nameText: {
    fontWeight: "600",
    fontSize: 18
  },
  slugText: {
    color: "#a39f9f",
    fontSize: 14,
    backgroundColor: "transparent"
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 6,
    color: "#4d4d4d"
  }
});
