import React from "react";
import {
  TouchableHighlight,
  View,
  StyleSheet,
  ActivityIndicator
} from "react-native";

import { Icon } from "./Icons";

export function IconButton({
  name,
  size = 16,
  style = {},
  onPress = () => {},
  color = "#009688",
  disabled = false
}) {
  return (
    <TouchableHighlight
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, { backgroundColor: color }, style]}
      underlayColor="#009D6E"
    >
      <View style={styles.contentContainer}>
        <Icon size={size} name={name} color="white" />
      </View>
    </TouchableHighlight>
  );
}

export class ActivityButton extends React.Component {
  state = { active: false };

  refresh = () => {
    const { onPress } = this.props;
    this.setState({ active: true }, () => {
      onPress(() => {
        this.setState({ active: false });
      });
    });
  };

  render() {
    const { name, style = {}, size = 36 } = this.props;
    const { active } = this.state;
    return (
      <>
        {active ? (
          <ActivityIndicator style={style} size="large" color="#009688" />
        ) : (
          <IconButton
            style={[style, { height: size, width: size, padding: 0 }]}
            name={name}
            size={size - 11}
            onPress={this.refresh}
          />
        )}
      </>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    padding: 5,
    marginTop: 5,
    marginBottom: 5
  },
  contentContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  }
});
