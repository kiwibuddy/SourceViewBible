/**
 * WordCloud Component
 * 
 * Gradient background container for word cloud displays.
 * Ported from legacy/App/js/Components/Charts/WordCloud.js
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WordCloudProps {
  children?: ReactNode;
  backgroundColors?: string[];
  style?: ViewStyle;
}

export function WordCloud({ children, backgroundColors, style }: WordCloudProps) {
  if (backgroundColors && backgroundColors.length >= 2) {
    return (
      <View style={style}>
        <LinearGradient
          colors={backgroundColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0.25 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.container}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    height: 200,
    overflow: 'hidden',
  },
});

export default WordCloud;
