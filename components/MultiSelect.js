import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Appearance } from "react-native-appearance";

import { Icon } from "./Icons";
import { MonoText, StyledText } from "./Texts";

function Option({ checked, option, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.optionContainer,
        style,
        Appearance.getColorScheme() === "dark"
          ? { backgroundColor: "black", borderColor: "white" }
          : {}
      ]}
    >
      <Icon size={40} name={checked ? "checkbox-outline" : "square-outline"} />
      <StyledText style={{ paddingHorizontal: 20 }}>{option}</StyledText>
    </TouchableOpacity>
  );
}

function Menu({ onPress, content, contentFallback, disabled, size = 35 }) {
  return (
    <TouchableOpacity
      style={styles.menuContainer}
      onPress={onPress}
      disabled={disabled}
    >
      <MonoText style={{ fontSize: 18 }} numberOfLines={1} ellipsizeMode="tail">
        {content ? content : contentFallback}
      </MonoText>
      <Icon size={size} name="arrow-dropdown" />
    </TouchableOpacity>
  );
}

export default class Multiselect extends React.Component {
  state = { expanded: false, selected: [] };

  onSelectedChanged = () => {
    const { onSelectedChanged } = this.props;
    if (onSelectedChanged) {
      onSelectedChanged(this.state.selected);
    }
  };

  toggle = () => {
    this.setState(({ expanded }, props) => {
      return { expanded: !expanded };
    });
  };

  toggleSelect = option => {
    this.setState(({ selected }, props) => {
      if (selected.indexOf(option) >= 0) {
        selected.splice(selected.indexOf(option), 1);
      } else {
        selected.push(option);
      }
      return { selected: selected };
    }, this.onSelectedChanged);
  };

  toggleSelectAll = () => {
    this.setState(({ selected = [] }, { options = [] }) => {
      if (selected.length == options.length) {
        return { selected: [] };
      } else {
        return { selected: options.slice() };
      }
    }, this.onSelectedChanged);
  };

  selected = selected => {
    return selected.reduce((a, b) => a + (a.length === 0 ? "" : ", ") + b, "");
  };

  componentDidUpdate() {
    const { options } = this.props;
    const { selected } = this.state;

    const filteredSelected = selected.filter(d => options.indexOf(d) >= 0);
    if (selected.length !== filteredSelected.length) {
      this.setState({ selected: filteredSelected }, this.onSelectedChanged);
    }
  }

  render() {
    const {
      allLabel,
      noneLabel,
      selectLabel,
      options = [],
      disabled = false
    } = this.props;
    const { expanded = false, selected = [] } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Menu
          disabled={disabled || !options.length}
          onPress={this.toggle}
          content={this.selected(options.length ? selected : [])}
          contentFallback={options.length ? selectLabel : noneLabel}
        />
        {expanded && (
          <Modal
            isVisible={expanded}
            style={{ margin: 0, flex: 1 }}
            onBackdropPress={this.toggle}
            onBackButtonPress={this.toggle}
          >
            <View style={styles.optionsContainer}>
              <Option
                style={{ borderTopWidth: 1 }}
                option={allLabel}
                onPress={this.toggleSelectAll}
                checked={options.length === selected.length}
              />
              {options.map((item, i) => (
                <Option
                  key={i}
                  option={item}
                  onPress={() => this.toggleSelect(item)}
                  checked={selected.indexOf(item) >= 0}
                />
              ))}
            </View>
          </Modal>
        )}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  optionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#000000",
    borderBottomWidth: 1
  },
  optionsContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch"
  },
  menuContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center"
  }
});
