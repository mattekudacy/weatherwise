import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

function CustomTabBarIcon({ name, color, size, focused }: 
  { name: string; color: string; size: number, focused: boolean }) {
  
  return (
    <View style={[
      styles.iconContainer,
      focused && styles.activeTabContainer
    ]}>
      <Ionicons name={name} size={size} color={color} />
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#9BA1A6' : '#687076',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            height: 80,
            paddingBottom: 20,
          },
          default: {
            backgroundColor: colorScheme === 'dark' ? '#1C1D1F' : '#FFFFFF',
            elevation: 8,
            height: 65,
            paddingBottom: 10,
          },
        }),
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <CustomTabBarIcon 
              name={focused ? "home" : "home-outline"} 
              size={size || 24} 
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size, focused }) => (
            <CustomTabBarIcon 
              name={focused ? "search" : "search-outline"} 
              size={size || 24} 
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <CustomTabBarIcon 
              name={focused ? "settings" : "settings-outline"} 
              size={size || 24} 
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    width: 42,
    borderRadius: 21,
  },
  activeTabContainer: {
    backgroundColor: 'rgba(76, 149, 245, 0.15)',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4c95f5',
  }
});