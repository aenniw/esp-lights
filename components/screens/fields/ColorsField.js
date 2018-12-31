import * as React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Locale from "../../common/Locale";
import Field from "./Field";

function ColorButton({ title, color, onPress }) {
  const style = StyleSheet.create({
    container: {
      height: 75,
      marginBottom: 5,
      marginRight: 5,
      backgroundColor: color
    }
  });

  return (
    <TouchableOpacity onPress={onPress} style={style.container}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

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
        <ColorButton key={i} title="-" color={c} onPress={() => onRemove(c)} />
      ))}
      <ColorButton title="+" color="gray" onPress={onToggle} />
    </Field>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 50
  }
});
