import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const safeStorage = {
  getItem: async (name: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') return null;
    return await AsyncStorage.getItem(name);
  },
  setItem: async (name: string, value: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') return;
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') return;
    await AsyncStorage.removeItem(name);
  }
};
