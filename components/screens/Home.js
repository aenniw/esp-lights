import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Picker,
  Slider,
  Button,
} from 'react-native';
import { SlidersColorPicker } from 'react-native-color';
import tinycolor from 'tinycolor2';
import Locale from '../common/Locale';

const LightModes = {
  Color: 'color',
  Ranbow1: 'rainbow-1',
  Ranbow2: 'rainbow-2',
  Switch1: 'switch-1',
  Switch2: 'switch-2',
};

function Field({ label, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldName}>{label}</Text>
      <View style={styles.fieldValue}>{children}</View>
    </View>
  );
}

export default class AssetExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recents: ['#247ba0', '#70c1b3', '#b2dbbf', '#f3ffbd', '#ff1654'],
      colors: [],
      color: tinycolor('#70c1b3'),
      mode: LightModes.Color,
      modalVisible: false,
    };
    this.pickColor = this.pickColor.bind(this);
    this.toggleColorPicker = this.toggleColorPicker.bind(this);
  }

  toggleColorPicker() {
    this.setState(({ modalVisible }) => {
      return { modalVisible: !modalVisible };
    });
  }

  pickColor(colorHex) {
    const { mode } = this.state;
    if (mode === LightModes.Color) {
      this.setState({
        modalVisible: false,
        color: colorHex,
      });
    } else {
      this.setState(({ colors }) => {
        colors.push(colorHex);
        return {
          modalVisible: false,
          colors: colors,
        };
      });
    }
    this.setState({
      recents: [
        colorHex,
        ...this.state.recents.filter(c => c !== colorHex).slice(0, 4),
      ],
    });
  }

  removeColor(colorHex) {
    this.setState(({ colors = [] }) => {
      const index = colors.indexOf(colorHex);
      if (index >= 0) {
        colors.splice(index, 1);
      }
      return { colors: colors };
    });
  }

  render() {
    const { mode, colors, color } = this.state;
    const { colorSelect } = this.props;
    return (
      <View style={styles.container}>
        <Field label="Mode:">
          <Picker
            style={styles.picker}
            onValueChange={m => this.setState({ mode: m })}
            selectedValue={mode}>
            {Object.keys(LightModes)
              .map(k => LightModes[k])
              .map(m => (
                <Picker.Item label={m} value={m} />
              ))}
          </Picker>
        </Field>

        {mode !== LightModes.Color && (
          <Field label="Speed:">
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              onSlidingComplete={v => this.setState({ speed: v })}
            />
          </Field>
        )}
        <Field label="Brightness:">
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            onSlidingComplete={v => this.setState({ brightness: v })}
          />
        </Field>
        {mode === LightModes.Color && (
          <Field label={Locale.getLabel('color')}>
            <Button title="" color={color} onPress={this.toggleColorPicker} />
          </Field>
        )}
        {(mode === LightModes.Switch1 || mode === LightModes.Switch2) && (
          <Field label={Locale.getLabel('colors')}>
            {colors.map(c => (
              <Button
                style={styles.colorsPicker}
                title="-"
                color={c}
                onPress={() => this.removeColor(c)}
              />
            ))}
            <Button
              style={styles.colorsPicker}
              title="+"
              color="gray"
              onPress={this.toggleColorPicker}
            />
          </Field>
        )}

        <SlidersColorPicker
          visible={this.state.modalVisible}
          color={tinycolor(color).toHsl()}
          returnMode={'hex'}
          onCancel={() => this.setState({ modalVisible: false })}
          onOk={this.pickColor}
          swatches={this.state.recents}
          swatchesLabel={Locale.getLabel('recent')}
          okLabel={Locale.getLabel('done')}
          cancelLabel={Locale.getLabel('cancel')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40,
  },
  field: {
    minHeight: 50,
    paddingBottom: 40,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fieldName: {
    width: '35%',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  fieldValue: {
    width: '60%',
  },
  picker: {
    height: 28,
  },
  slider: {
    height: 28,
  },
  colorsPicker: {},
});
