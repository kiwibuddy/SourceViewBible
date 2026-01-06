/**
 * Avatar Component
 * 
 * A reusable avatar component for displaying user/source avatars.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
// LinearGradient removed - requires native rebuild
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
  // Use the first color from gradient as background
  const backgroundColor = gradientColors?.[0] || Colors.sources.other.tint;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <View
        style={[styles.gradient, { borderRadius: size / 2, backgroundColor }]}
      >
        <Text style={[styles.initial, { fontSize }]}>{initial}</Text>
      </View>
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
