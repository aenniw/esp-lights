import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Appearance } from "react-native-appearance";

import { IconButton } from "./Buttons";
import { LocaleText } from "./Texts";

export function ModalButtons({ onClose, onPress, disabled = false }) {
  return (
    <View style={styles.modalButtons}>
      <IconButton
        style={styles.modalButton}
        name="close"
        size={40}
        onPress={onClose}
      />
      <IconButton
        style={styles.modalButton}
        name="checkmark"
        size={40}
        disabled={disabled}
        onPress={onPress}
      />
    </View>
  );
}

export function ModalHeader({ label, deviceSsid }) {
  return (
    <LocaleText
      label={label}
      placeholders={{ device: deviceSsid }}
      style={[
        styles.sectionContentText,
        { textAlign: "center", fontSize: 20, marginBottom: 20 }
      ]}
    />
  );
}

export function ModalTooltip({ label }) {
  return (
    <LocaleText
      style={[
        styles.tooltipText,
        Appearance.getColorScheme() === "dark"
          ? { backgroundColor: "#272727" }
          : {}
      ]}
      label={label}
    />
  );
}

export function ModalError({ errorMsg }) {
  if (!errorMsg) {
    return null;
  }
  return (
    <Text
      style={[
        styles.tooltipText,
        { color: "red" },
        Appearance.getColorScheme() === "dark"
          ? { backgroundColor: "#272727" }
          : {}
      ]}
    >
      {errorMsg}
    </Text>
  );
}

const styles = StyleSheet.create({
  sectionContentText: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold"
  },
  tooltipText: {
    fontSize: 14,
    backgroundColor: "lightgray",
    fontFamily: "space-mono",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 15
  },
  modalButtons: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalButton: { flex: 0.49 }
});
