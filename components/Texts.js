import React from "react";
import { Text } from "react-native";
import { Appearance } from "react-native-appearance";

import Locale from "../common/locale";

export function StyledText({
  label,
  placeholders = {},
  children,
  style,
  ...props
}) {
  return (
    <Text
      {...props}
      style={[
        style,
        Appearance.getColorScheme() === "dark" ? { color: "white" } : {}
      ]}
    >
      {label ? Locale.getLabel(label, placeholders) : children}
    </Text>
  );
}

export function LocaleText({ label, placeholders = {}, children, ...props }) {
  return (
    <StyledText {...props}>
      {label ? Locale.getLabel(label, placeholders) : children}
    </StyledText>
  );
}

export function MonoText({ style, ...props }) {
  return (
    <LocaleText {...props} style={[style, { fontFamily: "space-mono" }]} />
  );
}
