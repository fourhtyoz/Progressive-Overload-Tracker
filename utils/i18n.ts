import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

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

const getDeviceLanuguage = () => {
    try {
        const locales = Localization.getLocales()
        const languageCode = locales[0].languageCode
        return languageCode
    } catch (e) {
        console.error(`getDeviceLanuguage error: ${e}`)
        return 'en'
    }
}

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
