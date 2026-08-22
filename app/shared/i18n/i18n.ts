import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LANGUAGES } from '@/app/shared/constants/settings';
import de from '@/app/shared/i18n/de.json';
// translations
import en from '@/app/shared/i18n/en.json';
import es from '@/app/shared/i18n/es.json';
import ru from '@/app/shared/i18n/ru.json';
import tr from '@/app/shared/i18n/tr.json';

const resources = {
    en: {
        translation: en,
    },
    es: {
        translation: es,
    },
    de: {
        translation: de,
    },
    ru: {
        translation: ru,
    },
    tr: {
        translation: tr,
    },
};

export const getDeviceMeasurementSystem = () => {
    try {
        const locales = Localization.getLocales();
        const measurementSystem = locales[0].measurementSystem;
        if (measurementSystem === 'metric') {
            return 'kg';
        } else {
            return 'lb';
        }
    } catch (e) {
        console.error(`getDeviceMeasurementSystem error: ${e}`);
        return 'kg';
    }
};

export const getDeviceLanuguage = () => {
    try {
        const supportedLanguages = LANGUAGES.map((item) => item.code);

        const locales = Localization.getLocales();
        const languageCode = locales[0]?.languageCode;
        if (languageCode && supportedLanguages.includes(languageCode?.toLowerCase())) {
            return languageCode;
        } else {
            return 'en';
        }
    } catch (e) {
        console.error(`getDeviceLanuguage error: ${e}`);
        return 'en';
    }
};

void i18n.use(initReactI18next).init({
    resources,
    fallbackLng: getDeviceLanuguage() || 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
