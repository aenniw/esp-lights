import * as React from "react";
import { StyleSheet, Picker, View } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";

import { IconButton } from "../../components/Buttons";
import { StyledText } from "../../components/Texts";
import Locale from "../../common/locale";

const LightLabels = {
  Color: "color",
  Rainbow1: "rainbow-1",
  Rainbow2: "rainbow-2",
  Switch1: "switch-1",
  Switch2: "switch-2",
  Off: "off"
};

function Field({ label, style, children, visible = true }) {
  if (!visible) return null;
  return (
    <View style={[styles.field, style]}>
      <StyledText style={styles.fieldName}>
        {Locale.getLabel(label)}:
      </StyledText>
      <View style={styles.fieldValue}>{children}</View>
    </View>
  );
}

export function ColorField({ label, onPress, visible }) {
  return (
    <Field label={label} visible={visible}>
      <IconButton
        name="color-palette"
        onPress={onPress}
        style={{ height: 50 }}
        size={45}
      />
    </Field>
  );
}

export function ColorsField({
  label,
  colors = [],
  onToggle,
  onRemove,
  visible
}) {
  return (
    <Field label={label} visible={visible}>
      {colors.map((c, i) => (
        <IconButton
          style={styles.colors}
          size={45}
          key={i}
          color={c}
          name="remove"
          onPress={() => onRemove(c)}
        />
      ))}
      <IconButton
        style={styles.colors}
        size={45}
        name="add"
        color="gray"
        onPress={onToggle}
      />
    </Field>
  );
}

export function PickerField({ mode, label, onValueChange, visible }) {
  return (
    <Field label={label} visible={visible}>
      <Picker
        style={styles.picker}
        onValueChange={onValueChange}
        selectedValue={mode}
      >
        {Object.keys(LightLabels)
          .map(k => LightLabels[k])
          .map((m, i) => (
            <Picker.Item
              key={i}
              label={Locale.getLabel("esp.animations." + m)}
              value={i}
            />
          ))}
      </Picker>
    </Field>
  );
}

export function SliderField({
  value,
  label,
  onSlidingComplete,
  visible,
  min = 0,
  max = 100
}) {
  return (
    <Field label={label} visible={visible}>
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={min}
        maximumValue={max}
        onSlidingComplete={onSlidingComplete}
        thumbTintColor="#009688"
        minimumTrackTintColor="#009688"
      />
    </Field>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
    alignContent: "stretch",
    justifyContent: "space-between",
    alignItems: "center"
  },
  fieldName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 0.4
  },
  fieldValue: {
    paddingHorizontal: 10,
    flex: 0.6
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    color: "white"
  },
  picker: {
    backgroundColor: "#ededed",
    height: 28
  },
  slider: {
    height: 28
  },
  colors: {
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ededed"
  }
});
