import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, ScrollView, RefreshControl, Dimensions, ActivityIndicator } from "react-native";
import axios from "axios";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSettings } from "@/context/SettingsContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { convertTemperature, temperatureUnit } = useSettings();
  
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Get current time to determine if it's day or night
  const getTimeOfDay = () => {
    const hours = new Date().getHours();
    return hours >= 6 && hours < 18 ? 'day' : 'night';
  };
  
  const timeOfDay = getTimeOfDay();
  
  // Background gradient colors based on time of day
  const gradientColors = timeOfDay === 'day' 
    ? ['#4c95f5', '#1d62d1'] 
    : ['#1f2b44', '#0c1220'];

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(
        `https://api.weatherbit.io/v2.0/current?city=Valenzuela&country=PH&key=357d0242fecb4ab483f8a142c407bb5e`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchWeatherData();
  };

  // Get weather icon based on weather code and time of day
  const getWeatherIcon = (code: number) => {
    // Simplified example - you can expand with more icons
    if (code >= 200 && code < 300) return require('@/assets/images/weather/thunderstorm.png');
    if (code >= 300 && code < 400) return require('@/assets/images/weather/drizzle.png');
    if (code >= 500 && code < 600) return require('@/assets/images/weather/rain.png');
    if (code >= 600 && code < 700) return require('@/assets/images/weather/snow.png');
    if (code >= 700 && code < 800) return require('@/assets/images/weather/mist.png');
    if (code === 800) return timeOfDay === 'day' 
      ? require('@/assets/images/weather/clear-day.png') 
      : require('@/assets/images/weather/clear-night.png');
    if (code > 800) return timeOfDay === 'day'
      ? require('@/assets/images/weather/clouds-day.png')
      : require('@/assets/images/weather/clouds-night.png');
      
    return require('@/assets/images/weather/unknown.png');
  };

  if (!weather) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={styles.loadingText}>Loading weather data...</ThemedText>
      </ThemedView>
    );
  }

  const data = weather.data[0];
  const weatherCode = data.weather.code;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
        >
          <View style={styles.header}>
            <ThemedText style={styles.city}>{data.city_name}</ThemedText>
            <ThemedText style={styles.date}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </ThemedText>
          </View>

          <View style={styles.weatherMain}>
            <Image 
              source={getWeatherIcon(weatherCode)}
              style={styles.weatherIcon}
            />
            <View style={styles.tempContainer}>
              <ThemedText style={styles.temp}>
                {Math.round(convertTemperature(data.temp))}°
              </ThemedText>
              <ThemedText style={styles.unit}>
                {temperatureUnit === 'celsius' ? 'C' : 'F'}
              </ThemedText>
            </View>
            <ThemedText style={styles.condition}>{data.weather.description}</ThemedText>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Image 
                  source={require('@/assets/images/weather/icons/humidity.png')} 
                  style={styles.detailIcon} 
                />
                <ThemedText style={styles.detailLabel}>Humidity</ThemedText>
                <ThemedText style={styles.detailValue}>{data.rh}%</ThemedText>
              </View>
              <View style={styles.detailItem}>
                <Image 
                  source={require('@/assets/images/weather/icons/wind.png')} 
                  style={styles.detailIcon} 
                />
                <ThemedText style={styles.detailLabel}>Wind</ThemedText>
                <ThemedText style={styles.detailValue}>{data.wind_spd.toFixed(1)} m/s</ThemedText>
              </View>
            </View>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Image 
                  source={require('@/assets/images/weather/icons/pressure.png')} 
                  style={styles.detailIcon} 
                />
                <ThemedText style={styles.detailLabel}>Pressure</ThemedText>
                <ThemedText style={styles.detailValue}>{data.pres.toFixed(0)} mb</ThemedText>
              </View>
              <View style={styles.detailItem}>
                <Image 
                  source={require('@/assets/images/weather/icons/feelslike.png')} 
                  style={styles.detailIcon} 
                />
                <ThemedText style={styles.detailLabel}>Feels Like</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {Math.round(convertTemperature(data.app_temp))}°
                  {temperatureUnit === 'celsius' ? 'C' : 'F'}
                </ThemedText>
              </View>
            </View>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Image 
                  source={require('@/assets/images/weather/icons/uv.png')} 
                  style={styles.detailIcon} 
                />
                <ThemedText style={styles.detailLabel}>UV Index</ThemedText>
                <ThemedText style={styles.detailValue}>{data.uv.toFixed(1)}</ThemedText>
              </View>
              <View style={styles.detailItem}>
                <Image 
                  source={require('@/assets/images/weather/icons/visibility.png')} 
                  style={styles.detailIcon} 
                />
                <ThemedText style={styles.detailLabel}>Visibility</ThemedText>
                <ThemedText style={styles.detailValue}>{data.vis} km</ThemedText>
              </View>
            </View>
          </View>

          <ThemedText style={styles.updatedTime}>
            Last updated: {new Date(data.ob_time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </ThemedText>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const { width } = Dimensions.get('window');

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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  city: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginBottom: 5,
    lineHeight: 40, // Add this line
    includeFontPadding: false, // Add this line
  },
  date: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  weatherMain: {
    alignItems: 'center',
    marginVertical: 40,
  },
  weatherIcon: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temp: {
    fontSize: 80,
    fontWeight: "600",
    color: "#fff",
    lineHeight: 90,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    includeFontPadding: false, // Add this line
  },
  unit: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginTop: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  condition: {
    fontSize: 24,
    textTransform: "capitalize",
    color: "#fff",
    marginTop: 5,
    lineHeight: 30, // Add this line
    includeFontPadding: false, // Add this line
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    padding: 20,
    marginVertical: 30,
    backdropFilter: 'blur(10px)',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    alignItems: 'center',
    width: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    padding: 15,
  },
  detailIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
    tintColor: '#fff',
  },
  detailLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  updatedTime: {
    textAlign: 'center',
    fontSize: 12,
    color: "#fff",
    opacity: 0.7,
  },
});