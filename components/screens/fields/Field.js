import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Field({ label, children, visible = true }) {
  if (!visible) return null;
  return (
    <View style={styles.field}>
      <Text style={styles.fieldName}>{label}</Text>
      <View style={styles.fieldValue}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    paddingBottom: 40,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start"
  },
  fieldName: {
    width: "35%",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right"
  },
  fieldValue: {
    width: "60%"
  }
});
