import * as React from "react";
import { Text, View, StyleSheet, Picker, Slider, Button } from "react-native";
import { SlidersColorPicker } from "react-native-color";
import tinycolor from "tinycolor2";
import Locale from "../common/Locale";
import { LightRequests } from "../common/Common";
import ColorField from "./fields/ColorField";
import ColorsField from "./fields/ColorsField";
import PickerField from "./fields/PickerField";
import SliderField from "./fields/SliderField";

const LightModes = {
  Color: 0,
  Rainbow1: 1,
  Rainbow2: 2,
  Switch1: 3,
  Switch2: 4
};

const isSwitchMode = m => m === LightModes.Switch1 || m === LightModes.Switch2,
  isRainbowMode = m => m === LightModes.Rainbow1 || m === LightModes.Rainbow2;

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
      label="speed"
      min={isRainbowMode(mode) ? 185 : 40}
      max={isRainbowMode(mode) ? 255 : 180}
      onSlidingComplete={onSlidingComplete}
      visible={mode !== LightModes.Color}
    />
  );
}

export default class Device extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recents: ["#247ba0", "#70c1b3", "#b2dbbf", "#f3ffbd", "#ff1654"],
      colors: [],
      color: tinycolor("#70c1b3"),
      mode: LightModes.Color,
      modalVisible: false
    };

    this.pickColor = this.pickColor.bind(this);
    this.removeColor = this.removeColor.bind(this);
    this.toggleColorPicker = () => {
      this.setState(({ modalVisible }) => {
        return { modalVisible: !modalVisible };
      });
    };

    this.componentWillReceiveProps(props);
  }

  componentWillReceiveProps({ device }) {
    if (device) {
      LightRequests.getConfig(device).then(({ color, mode, ...other }) =>
        this.setState({
          ...other,
          color: d2h(color),
          mode: other["animation-type"]
        })
      );
      LightRequests.getAnimationColors(device).then(v =>
        this.setState({
          colors: v["animation-colors"].map(color => d2h(color))
        })
      );
    }

    this.setSpeed = v => {
      LightRequests.setSpeed(device, v).then(({ result }) => {
        if (result) this.setState({ speed: v });
      });
    };
    this.setBrightness = v => {
      LightRequests.setBrightness(device, v).then(({ result }) => {
        if (result) this.setState({ brightness: v });
      });
    };
    this.setMode = v => {
      LightRequests.setAnimationMode(device, v).then(({ result }) => {
        if (result) this.setState({ mode: v });
      });
    };
    this.setColor = v => {
      LightRequests.setColor(device, h2d(v));
    };
    this.setAnimationColors = v => {
      LightRequests.setAnimationColors(device, v.map(color => h2d(color)));
    };
  }

  pickColor(colorHex) {
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
  }

  removeColor(colorHex) {
    this.setState(({ colors = [] }) => {
      const index = colors.indexOf(colorHex);
      if (index >= 0) {
        colors.splice(index, 1);
      }
      this.setAnimationColors(colors);
      return { colors: colors };
    });
  }

  render() {
    const { colors, color, brightness, speed } = this.state,
      mode = 3;
    const { device } = this.props;
    if (!device)
      return (
        <View style={styles.container}>
          <Text style={styles.nodevice}>{Locale.getLabel("nodevice")}</Text>
        </View>
      );

    return (
      <View style={styles.container}>
        <PickerField mode={mode} label="mode" onValueChange={this.setMode} />
        <SpeedSlider
          value={speed}
          onSlidingComplete={this.setSpeed}
          mode={mode}
        />
        <SliderField
          value={brightness}
          label="brightness"
          onSlidingComplete={this.setBrightness}
        />
        <ColorField
          label="color"
          color={color}
          onPress={this.toggleColorPicker}
          visible={mode === LightModes.Color}
        />
        <ColorsField
          label="colors"
          colors={colors}
          onToggle={this.toggleColorPicker}
          onRemove={this.removeColor}
          visible={mode === LightModes.Switch1 || mode === LightModes.Switch2}
        />
        <SlidersColorPicker
          returnMode="hex"
          onOk={this.pickColor}
          color={tinycolor(color).toHsl()}
          visible={this.state.modalVisible}
          onCancel={this.toggleColorPicker}
          swatches={this.state.recents}
          swatchesLabel={Locale.getLabel("recent")}
          okLabel={Locale.getLabel("done")}
          cancelLabel={Locale.getLabel("cancel")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40
  },
  nodevice: {
    width: "100%",
    textAlign: "center"
  }
});
