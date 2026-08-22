import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';

import i18n from '@/app/shared/i18n/i18n';
import { getDeviceLanguage, getDeviceMeasurementSystem } from '@/app/shared/i18n/i18n';

type Theme = 'light' | 'dark';
type Language = 'en' | 'de' | 'es' | 'ru' | 'tr';
type Units = 'kg' | 'lb';

class SettingsStore {
    theme: Theme = 'light';
    language: Language = 'en';
    units: Units = 'kg';
    isLoading = true;

    constructor() {
        makeAutoObservable(this);
    }

    get isDark() {
        return this.theme === 'dark';
    }

    async setTheme(value: Theme) {
        runInAction(() => {
            this.theme = value;
        });
        await AsyncStorage.setItem('theme', value);
    }

    async setLanguage(value: Language) {
        runInAction(() => {
            this.language = value;
        });
        void i18n.changeLanguage(value);
        await AsyncStorage.setItem('language', value);
    }

    async setUnits(value: Units) {
        runInAction(() => {
            this.units = value;
        });
        await AsyncStorage.setItem('units', value);
    }

    setIsLoading(value: boolean) {
        this.isLoading = value;
    }

    async initialize() {
        runInAction(() => {
            this.isLoading = true;
        });
        try {
            const keys = ['theme', 'language', 'units'];
            const values = await AsyncStorage.multiGet(keys);
            values.forEach(([key, value]) => {
                switch (key) {
                    case 'theme':
                        runInAction(() => {
                            this.theme = (value as Theme) || 'light';
                        });
                        break;
                    case 'language':
                        runInAction(() => {
                            this.language = (value as Language) || getDeviceLanguage();
                            void i18n.changeLanguage(this.language);
                        });
                        break;
                    case 'units':
                        runInAction(() => {
                            this.units = (value as Units) || getDeviceMeasurementSystem();
                        });
                        break;
                    default:
                        break;
                }
            });
        } catch (error) {
            console.error('Error initializing settings:', error);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}

export const settingsStore = new SettingsStore();
