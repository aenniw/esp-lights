import { Platform, NativeModules } from "react-native";
import en from "./locales/en.json";
import i18n from "i18n-js";

function getLanguageCode() {
  let systemLanguage = "en";
  if (Platform.OS === "android") {
    systemLanguage = NativeModules.I18nManager.localeIdentifier;
  } else if (Platform.OS === "ios") {
    systemLanguage = NativeModules.SettingsManager.settings.AppleLocale;
  } else if (Platform.OS === "web") {
    systemLanguage = navigator.language;
  }
  return systemLanguage.substring(0, 2);
}

i18n.fallbacks = true;
i18n.translations = { en };
i18n.locale = getLanguageCode();
console.log("locale", i18n.locale);

export default class Locale {
  static getLabel(key = "", vals = {}) {
    return i18n.t(key, vals);
  }
}
