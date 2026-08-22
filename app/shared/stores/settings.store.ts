import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/app/shared/i18n/i18n';
import { getDeviceLanuguage, getDeviceMeasurementSystem } from '@/app/shared/i18n/i18n';

class SettingsStore {
    theme = '';
    fontSize = '';
    language = '';
    units = '';
    notifications = false;
    isLoading = true;

    constructor() {
        makeAutoObservable(this);
        this.initialize();
    }

    get isDark() {
        return this.theme === 'dark' ? true : false;
    }

    setTheme(value: string) {
        this.theme = value;
    }

    setFontsize(value: string) {
        this.fontSize = value;
    }

    setLanguage(value: string) {
        this.language = value;
        i18n.changeLanguage(value);
    }

    setUnits(value: string) {
        this.units = value;
    }

    toggleNotifications() {
        this.notifications = !this.notifications;
    }

    setIsLoading(value: boolean) {
        this.isLoading = value;
    }

    async initialize() {
        runInAction(() => {
            this.isLoading = true;
        });
        try {
            const keys = ['theme', 'fontSize', 'language', 'units', 'notifications'];
            const values = await AsyncStorage.multiGet(keys);
            values.forEach(([key, value]) => {
                switch (key) {
                    case 'theme':
                        runInAction(() => {
                            this.theme = value || 'light';
                        });
                        break;
                    case 'fontSize':
                        runInAction(() => {
                            this.fontSize = value || 'normal';
                        });
                        break;
                    case 'language':
                        runInAction(() => {
                            this.setLanguage(value || getDeviceLanuguage());
                        });
                        break;
                    case 'units':
                        runInAction(() => {
                            this.units = value || getDeviceMeasurementSystem();
                        });
                        break;
                    case 'notifications':
                        runInAction(() => {
                            if (value) {
                                try {
                                    const parsedValue = JSON.parse(value);
                                    this.notifications = parsedValue;
                                } catch (e) {
                                    console.error('initialize notifications', e);
                                }
                            } else {
                                this.notifications = true;
                            }
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
