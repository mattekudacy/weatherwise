import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

type SettingsContextType = {
  temperatureUnit: TemperatureUnit;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  convertTemperature: (tempCelsius: number) => number;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');

  useEffect(() => {
    // Load saved preference on startup
    const loadSavedUnit = async () => {
      try {
        const savedUnit = await AsyncStorage.getItem('temperatureUnit');
        if (savedUnit && (savedUnit === 'celsius' || savedUnit === 'fahrenheit')) {
          setTemperatureUnit(savedUnit);
        }
      } catch (error) {
        console.error('Failed to load temperature unit preference', error);
      }
    };

    loadSavedUnit();
  }, []);

  const saveTempUnit = async (unit: TemperatureUnit) => {
    try {
      await AsyncStorage.setItem('temperatureUnit', unit);
      setTemperatureUnit(unit);
    } catch (error) {
      console.error('Failed to save temperature unit preference', error);
    }
  };

  const convertTemperature = (tempCelsius: number): number => {
    if (temperatureUnit === 'fahrenheit') {
      // Convert Celsius to Fahrenheit: (C × 9/5) + 32
      return (tempCelsius * 9/5) + 32;
    }
    return tempCelsius;
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        temperatureUnit, 
        setTemperatureUnit: saveTempUnit,
        convertTemperature
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};