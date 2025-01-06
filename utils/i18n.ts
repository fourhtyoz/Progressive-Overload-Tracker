import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import * as RNLocalize from 'react-native-localize';

// translations
import en from '@/utils/translations/en.json';
import es from '@/utils/translations/es.json';
import de from '@/utils/translations/de.json';
import ru from '@/utils/translations/ru.json';
import tr from '@/utils/translations/tr.json';

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  de: {
    translation: de
  },
  ru: {
    translation: ru
  },
  tr: {
    translation: tr
  },
};

i18n
  .use(initReactI18next) // Passes i18n to react-i18next.
  .init({
    resources,
    fallbackLng: 'en', // Default language
    // lng: RNLocalize.getLocales()[0].languageCode, // Auto-detect device language
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
