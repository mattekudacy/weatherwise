import React from 'react';
import { StyleSheet, Switch, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSettings, TemperatureUnit } from '@/context/SettingsContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { temperatureUnit, setTemperatureUnit } = useSettings();
  const tintColor = useThemeColor({}, 'tint');
  
  const toggleTemperatureUnit = () => {
    const newUnit: TemperatureUnit = temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTemperatureUnit(newUnit);
  };

  // Background gradient colors
  const gradientColors = ['#4c95f5', '#1d62d1'];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText style={styles.title}>Settings</ThemedText>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingHeader}>
              <Image
                source={require('@/assets/images/weather/icons/temperature.png')}
                style={styles.headerIcon}
              />
              <ThemedText style={styles.settingTitle}>Temperature Units</ThemedText>
            </View>
            
            <View style={styles.settingContent}>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>Display Temperature As</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Choose between Celsius and Fahrenheit for all temperature readings
                </ThemedText>
              </View>
              
              <View style={styles.unitSwitchContainer}>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    temperatureUnit === 'celsius' && styles.activeUnitButton
                  ]}
                  onPress={() => setTemperatureUnit('celsius')}
                >
                  <ThemedText style={[
                    styles.unitButtonText,
                    temperatureUnit === 'celsius' && styles.activeUnitText
                  ]}>°C</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    temperatureUnit === 'fahrenheit' && styles.activeUnitButton
                  ]}
                  onPress={() => setTemperatureUnit('fahrenheit')}
                >
                  <ThemedText style={[
                    styles.unitButtonText,
                    temperatureUnit === 'fahrenheit' && styles.activeUnitText
                  ]}>°F</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingHeader}>
              <Image
                source={require('@/assets/images/weather/icons/info.png')}
                style={styles.headerIcon}
              />
              <ThemedText style={styles.settingTitle}>About</ThemedText>
            </View>
            
            <View style={styles.aboutContent}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.appIcon}
              />
              
              <ThemedText style={styles.appName}>WeatherWise</ThemedText>
              <ThemedText style={styles.appVersion}>Version 1.0.0</ThemedText>
              
              <ThemedText style={styles.appDescription}>
                Stay updated with accurate weather forecasts and prepare for the day ahead. 
                WeatherWise helps you make smart decisions based on current weather conditions.
              </ThemedText>
              
              <View style={styles.creditsContainer}>
                <ThemedText style={styles.creditsText}>
                  Weather data provided by:
                </ThemedText>
                <ThemedText style={styles.creditsName}>
                  Weatherbit.io
                </ThemedText>
              </View>
            </View>
          </View>
          
          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              © 2023 WeatherWise. All rights reserved.
            </ThemedText>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    lineHeight: 42, // Add this line
    includeFontPadding: false, // Add this line
  },
  settingsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    marginBottom: 25,
    overflow: 'hidden',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: '#fff',
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  settingContent: {
    padding: 20,
  },
  settingInfo: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  unitSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 5,
  },
  unitButton: {
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 10,
  },
  activeUnitButton: {
    backgroundColor: '#fff',
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  activeUnitText: {
    color: '#4c95f5',
  },
  aboutContent: {
    padding: 20,
    alignItems: 'center',
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 15,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
    marginBottom: 20,
  },
  appDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  creditsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  creditsText: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.8,
  },
  creditsName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 5,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.6,
  },
});