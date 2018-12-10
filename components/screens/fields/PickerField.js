import * as React from "react";
import { StyleSheet, Picker } from "react-native";
import Locale from "../../common/Locale";
import Field from "./Field";

const LightLabels = {
  Color: "color",
  Rainbow1: "rainbow-1",
  Rainbow2: "rainbow-2",
  Switch1: "switch-1",
  Switch2: "switch-2"
};

export default function PickerField({ mode, label, onValueChange, visible }) {
  return (
    <Field label={Locale.getLabel(label)} visible={visible}>
      <Picker
        style={styles.picker}
        onValueChange={onValueChange}
        selectedValue={mode}
      >
        {Object.keys(LightLabels)
          .map(k => LightLabels[k])
          .map((m, i) => (
            <Picker.Item key={i} label={m} value={i} />
          ))}
      </Picker>
    </Field>
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 28
  }
});
