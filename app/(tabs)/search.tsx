import React, { useState } from "react";
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  ScrollView
} from "react-native";
import axios from "axios";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSettings } from "@/context/SettingsContext";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function SearchScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const inputBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const { convertTemperature, temperatureUnit } = useSettings();

  // Background gradient colors
  const gradientColors = ['#4c95f5', '#1d62d1'];

  const searchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://api.weatherbit.io/v2.0/current?city=${city}&key=357d0242fecb4ab483f8a142c407bb5e`
      );
      setWeather(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("City not found or network error. Please try again.");
      setLoading(false);
      setWeather(null);
    }
  };

  // Get weather icon based on weather code
  const getWeatherIcon = (code: number) => {
    // Simplified example - you can expand with more icons
    if (code >= 200 && code < 300) return require('@/assets/images/weather/thunderstorm.png');
    if (code >= 300 && code < 400) return require('@/assets/images/weather/drizzle.png');
    if (code >= 500 && code < 600) return require('@/assets/images/weather/rain.png');
    if (code >= 600 && code < 700) return require('@/assets/images/weather/snow.png');
    if (code >= 700 && code < 800) return require('@/assets/images/weather/mist.png');
    if (code === 800) return require('@/assets/images/weather/clear-day.png');
    if (code > 800) return require('@/assets/images/weather/clouds-day.png');
      
    return require('@/assets/images/weather/unknown.png');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <ThemedText style={styles.title}>Search Weather</ThemedText>
            
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter city name"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={city}
                onChangeText={setCity}
                onSubmitEditing={searchWeather}
                returnKeyType="search"
              />
              
              <TouchableOpacity 
                style={styles.searchButton} 
                onPress={searchWeather}
              >
                <Ionicons name="search" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            {loading ? (
              <ActivityIndicator size="large" color="#fff" style={styles.loader} />
            ) : weather ? (
              <View style={styles.weatherContainer}>
                <Image 
                  source={getWeatherIcon(weather.data[0].weather.code)}
                  style={styles.weatherIcon}
                />
                
                <ThemedText style={styles.city}>
                  {weather.data[0].city_name}, {weather.data[0].country_code}
                </ThemedText>
                
                <View style={styles.tempContainer}>
                  <ThemedText style={styles.temp}>
                    {Math.round(convertTemperature(weather.data[0].temp))}°
                  </ThemedText>
                  <ThemedText style={styles.tempUnit}>
                    {temperatureUnit === 'celsius' ? 'C' : 'F'}
                  </ThemedText>
                </View>
                
                <ThemedText style={styles.condition}>
                  {weather.data[0].weather.description}
                </ThemedText>
                
                <View style={styles.detailsCard}>
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Image 
                        source={require('@/assets/images/weather/icons/humidity.png')} 
                        style={styles.detailIcon} 
                      />
                      <View style={styles.detailTextContainer}>
                        <ThemedText style={styles.detailLabel}>Humidity</ThemedText>
                        <ThemedText style={styles.detailValue}>{weather.data[0].rh}%</ThemedText>
                      </View>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Image 
                        source={require('@/assets/images/weather/icons/wind.png')} 
                        style={styles.detailIcon} 
                      />
                      <View style={styles.detailTextContainer}>
                        <ThemedText style={styles.detailLabel}>Wind</ThemedText>
                        <ThemedText style={styles.detailValue}>
                          {weather.data[0].wind_spd.toFixed(1)} m/s
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Image 
                        source={require('@/assets/images/weather/icons/uv.png')} 
                        style={styles.detailIcon} 
                      />
                      <View style={styles.detailTextContainer}>
                        <ThemedText style={styles.detailLabel}>UV Index</ThemedText>
                        <ThemedText style={styles.detailValue}>
                          {weather.data[0].uv.toFixed(1)}
                        </ThemedText>
                      </View>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Image 
                        source={require('@/assets/images/weather/icons/feelslike.png')} 
                        style={styles.detailIcon} 
                      />
                      <View style={styles.detailTextContainer}>
                        <ThemedText style={styles.detailLabel}>Feels Like</ThemedText>
                        <ThemedText style={styles.detailValue}>
                          {Math.round(convertTemperature(weather.data[0].app_temp))}°
                          {temperatureUnit === 'celsius' ? 'C' : 'F'}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Image 
                  source={require('@/assets/images/weather/search-illustration.png')}
                  style={styles.emptyStateImage}
                />
                <ThemedText style={styles.emptyStateText}>
                  Enter a city name to get the current weather
                </ThemedText>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    lineHeight: 42, // Add this line
    includeFontPadding: false, // Add this line
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: "#fff",
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 55,
    height: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 30,
  },
  errorText: {
    color: "#FFD700",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  loader: {
    marginTop: 50,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyStateText: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  weatherContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  weatherIcon: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  city: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    lineHeight: 36, // Add this line
    includeFontPadding: false, // Add this line
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temp: {
    fontSize: 70,
    fontWeight: "600",
    color: "#fff",
    lineHeight: 80,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  tempUnit: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginTop: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  condition: {
    fontSize: 20,
    textTransform: "capitalize",
    color: "#fff",
    marginTop: 5,
    marginBottom: 30,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    padding: 15,
    marginBottom: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 12,
  },
  detailIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#fff',
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});