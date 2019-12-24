import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Appearance } from "react-native-appearance";

export function Icon({
  name,
  size = 26,
  style = {},
  color = Appearance.getColorScheme() === "dark" ? "white" : "black"
}) {
  return (
    <Ionicons
      size={size}
      style={[{ paddingHorizontal: 8 }, style]}
      color={color}
      name={(Platform.OS === "ios" ? "ios-" : "md-") + name}
    />
  );
}

export function TabBarIcon({ focused, ...props }) {
  return (
    <Icon
      size={35}
      style={{ marginTop: 10 }}
      {...props}
      color={focused ? "#009D6E" : "#ccc"}
    />
  );
}
