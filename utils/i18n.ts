import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { LANGUAGES } from '@/constants/settings';

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

export const getDeviceMeasurementSystem= () => {
    try {
        const locales = Localization.getLocales()
        const measurementSystem = locales[0].measurementSystem
        if (measurementSystem === 'metric') {
            return 'kg'
        } else {
            return 'lb'
        }
    } catch (e) {
        console.error(`getDeviceMeasurementSystem error: ${e}`)
        return 'kg'
    }
};

export const getDeviceLanuguage = () => {
    try {
        const supportedLanguages = LANGUAGES.map(item => item.code)
        
        const locales = Localization.getLocales()
        const languageCode = locales[0].languageCode
        if (languageCode && supportedLanguages.includes(languageCode?.toLowerCase())) {
            return languageCode
        } else {
            return 'en'
        }
    } catch (e) {
        console.error(`getDeviceLanuguage error: ${e}`)
        return 'en'
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: getDeviceLanuguage() || 'en',
        interpolation: {
            escapeValue: false
        }
});

export default i18n;
