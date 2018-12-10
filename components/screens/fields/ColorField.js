import * as React from "react";
import { Button } from "react-native";
import Locale from "../../common/Locale";
import Field from "./Field";

export default function ColorField({ label, color, onPress, visible }) {
  return (
    <Field label={Locale.getLabel(label)} visible={visible}>
      <Button title="" color={color} onPress={onPress} />
    </Field>
  );
}
