import * as React from "react";
import { StyleSheet, Slider } from "react-native";
import Locale from "../../common/Locale";
import Field from "./Field";

export default function SliderField({
  value,
  label,
  onSlidingComplete,
  visible,
  min = 0,
  max = 100
}) {
  return (
    <Field label={Locale.getLabel(label)} visible={visible}>
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={min}
        maximumValue={max}
        onSlidingComplete={onSlidingComplete}
      />
    </Field>
  );
}

const styles = StyleSheet.create({
  slider: {
    height: 28
  }
});
