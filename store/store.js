import { makeAutoObservable, runInAction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/utils/i18n";

class SettingsStore {
    theme = ''
    fontSize = ''
    language = ''
    units = ''
    notifications = false
    isLoading = true;

    constructor() {
        makeAutoObservable(this)
    }

    get isDark() {
        return this.theme === 'dark' ? true : false
    }

    setTheme(value) {
        this.theme = value
    }

    setFontsize(value) {
        this.fontSize = value
    }

    setLanguage(value) {
        this.language = value
        i18n.changeLanguage(value)
    }

    setUnits(value) {
        this.units = value
    }

    toggleNotifications() {
        this.notifications = !this.notifications
    }
    
    setIsLoading(value) {
        this.isLoading = value
    }

    async initialize() {
        runInAction(() => {
            this.isLoading = true
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
                            this.fontSize = value || 'normal' ;
                        });
                        break;
                    case 'language':
                        runInAction(() => {
                            this.setLanguage(value || 'en')
                        });
                        break;
                    case 'units':
                        runInAction(() => {
                            this.units = value || 'kg' ;
                        });
                        break;
                    case 'notifications':
                        runInAction(() => {
                            if (value) {
                                try {
                                    const parsedValue = JSON.parse(value)
                                    this.notifications = parsedValue;
                                } catch (e) {
                                    console.error('initialize notifications', e)
                                }
                            } else {
                                this.notifications = true
                            }
                        });
                        break;
                    default:
                        break;
                }
            })
        } catch (error) {
            console.error("Error initializing settings:", error);
        } finally {
            runInAction(() => {
                this.isLoading = false
            });
        }
    }
}

export const settingsStore = new SettingsStore();