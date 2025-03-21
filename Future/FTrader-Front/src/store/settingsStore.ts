import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Appearance
  darkMode: boolean;
  compactView: boolean;
  
  // Notifications
  tradeAlerts: boolean;
  priceAlerts: boolean;
  newsAlerts: boolean;
  emailNotifications: boolean;
  
  // Security
  twoFactorAuth: boolean;
  loginNotifications: boolean;
  
  // Display
  currency: string;
  language: string;
  timezone: string;

  // Connection
  offlineMode: boolean;
  
  // Actions
  setDarkMode: (darkMode: boolean) => void;
  setCompactView: (compactView: boolean) => void;
  setTradeAlerts: (tradeAlerts: boolean) => void;
  setPriceAlerts: (priceAlerts: boolean) => void;
  setNewsAlerts: (newsAlerts: boolean) => void;
  setEmailNotifications: (emailNotifications: boolean) => void;
  setTwoFactorAuth: (twoFactorAuth: boolean) => void;
  setLoginNotifications: (loginNotifications: boolean) => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
  setTimezone: (timezone: string) => void;
  setOfflineMode: (offlineMode: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  darkMode: true,
  compactView: false,
  tradeAlerts: true,
  priceAlerts: true,
  newsAlerts: false,
  emailNotifications: true,
  twoFactorAuth: false,
  loginNotifications: true,
  currency: 'USD',
  language: 'en',
  timezone: 'UTC',
  offlineMode: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setDarkMode: (darkMode) => set({ darkMode }),
      setCompactView: (compactView) => set({ compactView }),
      setTradeAlerts: (tradeAlerts) => set({ tradeAlerts }),
      setPriceAlerts: (priceAlerts) => set({ priceAlerts }),
      setNewsAlerts: (newsAlerts) => set({ newsAlerts }),
      setEmailNotifications: (emailNotifications) => set({ emailNotifications }),
      setTwoFactorAuth: (twoFactorAuth) => set({ twoFactorAuth }),
      setLoginNotifications: (loginNotifications) => set({ loginNotifications }),
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      setTimezone: (timezone) => set({ timezone }),
      setOfflineMode: (offlineMode) => set({ offlineMode }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'ftrader-settings',
    }
  )
);
