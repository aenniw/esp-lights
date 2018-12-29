import { Platform, NativeModules } from "react-native";
import en from "./locales/en.json";
import sk from "./locales/sk.json";
import i18n from "i18n-js";

function getLanguageCode() {
  let systemLanguage = "en";
  if (Platform.OS === "android") {
    systemLanguage = NativeModules.I18nManager.localeIdentifier;
  } else {
    systemLanguage = NativeModules.SettingsManager.settings.AppleLocale;
  }
  const languageCode = systemLanguage.substring(0, 2);
  console.log("locale", languageCode);
  return languageCode;
}

i18n.fallbacks = true;
i18n.translations = { en, sk };
i18n.locale = getLanguageCode();

export default class Locale {
  static getLabel(key = "", vals = {}) {
    return i18n.t(key, vals);
  }
}
