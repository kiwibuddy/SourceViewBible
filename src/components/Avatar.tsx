/**
 * Avatar Component
 * 
 * A reusable avatar component for displaying user/source avatars.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../common/colors';

interface AvatarProps {
  name?: string;
  size?: number;
  gradientColors?: string[];
  style?: ViewStyle;
}

export function Avatar({
  name,
  size = 40,
  gradientColors = Colors.sources.other.gradient.big,
  style,
}: AvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const fontSize = size * 0.45;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: size / 2 }]}
      >
        <Text style={[styles.initial, { fontSize }]}>{initial}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default Avatar;
