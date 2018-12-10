import * as React from "react";
import { StyleSheet, Button } from "react-native";
import Locale from "../../common/Locale";
import Field from "./Field";

export default function ColorsField({
  label,
  colors = [],
  onToggle,
  onRemove,
  visible
}) {
  return (
    <Field label={Locale.getLabel(label)} visible={visible}>
      {colors.map((c, i) => (
        <Button
          key={i}
          style={styles.colorsPicker}
          title="-"
          color={c}
          onPress={() => onRemove(c)}
        />
      ))}
      <Button
        style={styles.colorsPicker}
        title="+"
        color="gray"
        onPress={onToggle}
      />
    </Field>
  );
}

const styles = StyleSheet.create({
  colorsPicker: {}
});
