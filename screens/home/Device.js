import * as React from "react";
import { View, StyleSheet } from "react-native";
import { SlidersColorPicker } from "react-native-color";
import tinycolor from "tinycolor2";

import Locale from "../../common/locale";
import { LightRequests } from "../../common/request";
import {
  ColorField,
  ColorsField,
  PickerField,
  SliderField
} from "./DeviceFields";

const LightModes = {
  Color: 0,
  Rainbow1: 1,
  Rainbow2: 2,
  Switch1: 3,
  Switch2: 4,
  Off: 5
};

function d2h(d) {
  var hex = Number(d)
    .toString(16)
    .toUpperCase();
  while (hex.length < 6) {
    hex = "0" + hex;
  }
  return "#" + hex;
}
function h2d(h) {
  return parseInt(h.indexOf("#") >= 0 ? h.substring(1) : h, 16);
}

function SpeedSlider({ value, mode, onSlidingComplete }) {
  return (
    <SliderField
      value={value}
      label="esp.speed"
      min={180}
      max={255}
      onSlidingComplete={onSlidingComplete}
      visible={mode !== LightModes.Color && mode !== LightModes.Off}
    />
  );
}

export default class Device extends React.Component {
  state = {
    recents: ["#247ba0", "#70c1b3", "#b2dbbf", "#f3ffbd", "#ff1654"],
    colors: [],
    color: tinycolor("#70c1b3"),
    mode: undefined,
    modalVisible: false
  };

  componentDidMount() {
    this.getConfig();
    this.configListener = setInterval(this.getConfig, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.configListener);
  }

  getConfig = () => {
    const { devices = [] } = this.props;
    if (devices.length) {
      const device = devices[0];
      LightRequests.getConfig(device).then(v => {
        if (!v) return;
        const { color, mode, ...other } = v;
        this.setState({
          ...other,
          color: d2h(color),
          mode: other["animation-type"]
        });
      });
      LightRequests.getAnimationColors(device).then(v => {
        if (!v) return;
        this.setState({
          colors: v["animation-colors"].map(color => d2h(color))
        });
      });
    }
  };

  setSpeed = v => {
    const { devices = [] } = this.props;
    Promise.all(devices.map(device => LightRequests.setSpeed(device, v)))
      .then(values =>
        values
          .filter(r => r)
          .reduce((a, b) => a.result && b.result, { result: true })
      )
      .then(result => {
        if (result) this.setState({ speed: v });
      });
  };

  setBrightness = v => {
    const { devices = [] } = this.props;
    Promise.all(devices.map(device => LightRequests.setBrightness(device, v)))
      .then(values =>
        values
          .filter(r => r)
          .reduce((a, b) => a.result && b.result, { result: true })
      )
      .then(result => {
        if (result) this.setState({ brightness: v });
      });
  };

  setMode = v => {
    const { devices = [] } = this.props;
    Promise.all(
      devices.map(device => LightRequests.setAnimationMode(device, v))
    )
      .then(values =>
        values
          .filter(r => r)
          .reduce((a, b) => a.result && b.result, { result: true })
      )
      .then(result => {
        if (result) this.setState({ mode: Number(v) });
      });
  };

  setColor = v => {
    const { devices = [] } = this.props;
    devices.map(device => LightRequests.setColor(device, h2d(v)));
  };

  setAnimationColors = v => {
    const { devices = [] } = this.props;
    devices.map(device =>
      LightRequests.setAnimationColors(
        device,
        v.map(color => h2d(color))
      )
    );
  };

  toggleColorPicker = () => {
    this.setState(({ modalVisible }) => {
      return { modalVisible: !modalVisible };
    });
  };

  pickColor = colorHex => {
    const { mode } = this.state;
    if (mode === LightModes.Color) {
      this.setState(() => {
        this.setColor(colorHex);
        return {
          modalVisible: false,
          color: colorHex
        };
      });
    } else {
      this.setState(({ colors }) => {
        colors.push(colorHex);
        this.setAnimationColors(colors);
        return {
          modalVisible: false,
          colors: colors
        };
      });
    }
    this.setState({
      recents: [
        colorHex,
        ...this.state.recents.filter(c => c !== colorHex).slice(0, 4)
      ]
    });
  };

  removeColor = colorHex => {
    this.setState(({ colors = [] }) => {
      const index = colors.indexOf(colorHex);
      if (index >= 0) {
        colors.splice(index, 1);
      }
      this.setAnimationColors(colors);
      return { colors: colors };
    });
  };

  render() {
    const {
      mode,
      colors,
      color,
      brightness,
      speed,
      modalVisible,
      recents
    } = this.state;

    if (mode === null || mode === undefined) return null;
    return (
      <View style={styles.container}>
        <PickerField
          mode={mode}
          label="esp.mode"
          onValueChange={this.setMode}
        />
        <SpeedSlider
          value={speed}
          onSlidingComplete={this.setSpeed}
          mode={mode}
        />
        <SliderField
          value={brightness}
          label="esp.brightness"
          onSlidingComplete={this.setBrightness}
          visible={mode !== LightModes.Off}
        />
        <ColorField
          label="esp.color"
          onPress={this.toggleColorPicker}
          visible={mode === LightModes.Color}
        />
        <ColorsField
          label="esp.colors"
          colors={colors}
          onToggle={this.toggleColorPicker}
          onRemove={this.removeColor}
          visible={mode === LightModes.Switch1 || mode === LightModes.Switch2}
        />
        {modalVisible && (
          <SlidersColorPicker
            onOk={this.pickColor}
            onCancel={this.toggleColorPicker}
            returnMode="hex"
            color={tinycolor(color).toHsl()}
            visible={modalVisible}
            swatches={recents}
            swatchesLabel={Locale.getLabel("common.recent")}
            okLabel={Locale.getLabel("common.done")}
            cancelLabel={Locale.getLabel("common.cancel")}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40
  }
});
