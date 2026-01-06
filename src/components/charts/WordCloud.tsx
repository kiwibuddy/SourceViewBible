/**
 * WordCloud Component
 * 
 * Gradient background container for word cloud displays.
 * Ported from legacy/App/js/Components/Charts/WordCloud.js
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
// LinearGradient removed - requires native rebuild

interface WordCloudProps {
  children?: ReactNode;
  backgroundColors?: string[];
  style?: ViewStyle;
}

export function WordCloud({ children, backgroundColors, style }: WordCloudProps) {
  // Use first color from backgroundColors as solid background
  const backgroundColor = backgroundColors?.[0] || '#FFF';
  
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {children}
    </View>
  );
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
