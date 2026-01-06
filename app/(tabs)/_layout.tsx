/**
 * Tab Layout
 * 
 * Main navigation tabs for the app.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../src/common';
import { Icon } from '../../src/components';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        tabBarInactiveTintColor: Colors.subtitle,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: Colors.separator,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: Colors.tint,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Icon name="books" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'Books',
          tabBarIcon: ({ color, size }) => (
            <Icon name="books-filled" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sources"
        options={{
          title: 'Sources',
          tabBarIcon: ({ color, size }) => (
            <Icon name="avatar-human-male" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="spheres"
        options={{
          title: 'Spheres',
          tabBarIcon: ({ color, size }) => (
            <Icon name="religion-filled" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
