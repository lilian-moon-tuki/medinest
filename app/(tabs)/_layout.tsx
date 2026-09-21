import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textPrimary,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 10,
          borderTopWidth: 0,
          backgroundColor: colors.background,
          ...(shadows.card as object),
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={26} color={color} /> }}
      />
      <Tabs.Screen
        name="appointment"
        options={{ tabBarIcon: ({ color }) => <Ionicons name="calendar" size={26} color={color} /> }}
      />
      <Tabs.Screen
        name="prescriptions"
        options={{ tabBarIcon: ({ color }) => <Ionicons name="clipboard" size={26} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={26} color={color} /> }}
      />
    </Tabs>
  );
}
