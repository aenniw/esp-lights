import React from "react";
import { Keyboard, Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { BottomTabBar } from "react-navigation-tabs";
import { Appearance } from "react-native-appearance";

import { TabBarIcon } from "../components/Icons";
import HomeScreen from "../screens/home/HomeScreen";
import WizzardScreen from "../screens/wizzard/WizzardScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

function defaultNavigationOptions() {
  return {
    headerStyle: {
      backgroundColor:
        Appearance.getColorScheme() === "dark" ? "black" : "white",
      borderBottomWidth: 1,
      borderColor: "white"
    }
  };
}

const config = Platform.select({
  web: {
    headerMode: "screen",
    defaultNavigationOptions: defaultNavigationOptions
  },
  default: {
    defaultNavigationOptions: defaultNavigationOptions
  }
});

function createStack(home, config, navigationOptions) {
  const Stack = createStackNavigator({ Home: home }, config);
  Stack.navigationOptions = navigationOptions;
  Stack.navigationOptions.title = " ";
  Stack.path = "";
  return Stack;
}

class TabBar extends React.Component {
  state = { keyboardVisible: false };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    this.appearanceListener = Appearance.addChangeListener(({ colorScheme }) =>
      this.setState({ colorScheme: colorScheme })
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.appearanceListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ keyboardVisible: true });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardVisible: false });
  };

  render() {
    const {
      keyboardVisible,
      colorScheme = Appearance.getColorScheme()
    } = this.state;
    const { style } = this.props;
    return (
      <BottomTabBar
        {...this.props}
        style={[
          keyboardVisible ? [style, { display: "none" }] : {},
          colorScheme === "dark" ? { backgroundColor: "black" } : {}
        ]}
      />
    );
  }
}

export default createBottomTabNavigator(
  {
    Add: createStack(WizzardScreen, config, {
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="add" />
    }),
    Dashboard: createStack(HomeScreen, config, {
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="apps" />
    }),
    Settings: createStack(SettingsScreen, config, {
      tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name="options" />
      )
    })
  },
  {
    initialRouteName: "Dashboard",
    tabBarComponent: props => <TabBar {...props} />
  }
);
