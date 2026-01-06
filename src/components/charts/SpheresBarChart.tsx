/**
 * SpheresBarChart Component
 * 
 * Bar chart showing sphere distribution (family, economics, etc.).
 * Ported from legacy/App/js/Components/Charts/SpheresBarChart.js
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, SphereType } from '../../common/colors';

interface SphereData {
  family?: number;
  economics?: number;
  government?: number;
  religion?: number;
  education?: number;
  communication?: number;
  celebration?: number;
}

interface SpheresBarChartProps {
  data: SphereData[];
  horizontal?: boolean;
  style?: ViewStyle;
  barStyle?: ViewStyle;
}

export function SpheresBarChart({
  data,
  horizontal = true,
  style,
  barStyle,
}: SpheresBarChartProps) {
  const sphereTypes = [
    SphereType.FAMILY,
    SphereType.ECONOMICS,
    SphereType.GOVERNMENT,
    SphereType.RELIGION,
    SphereType.EDUCATION,
    SphereType.COMMUNICATION,
    SphereType.CELEBRATION,
  ];

  // Calculate max value for scaling
  let maxValue = 0;
  data.forEach((item) => {
    Object.values(item).forEach((value) => {
      if (value && value > maxValue) {
        maxValue = value;
      }
    });
  });

  if (maxValue === 0) maxValue = 1;

  const renderBars = () => {
    return sphereTypes.map((type, index) => {
      const item = data[index] || {};
      const value = item[type as keyof SphereData] || 0;
      const percentage = (value / maxValue) * 100;
      const color = Colors.spheres[type].tint;

      if (horizontal) {
        return (
          <View
            key={type}
            style={[
              styles.barHorizontal,
              { backgroundColor: color, width: `${percentage}%` },
              barStyle,
            ]}
          />
        );
      }

      return (
        <View
          key={type}
          style={[
            styles.barVertical,
            { backgroundColor: color, height: `${percentage}%` },
            barStyle,
          ]}
        />
      );
    });
  };

  return (
    <View style={[horizontal ? styles.containerHorizontal : styles.containerVertical, style]}>
      {renderBars()}
    </View>
  );
}

const styles = StyleSheet.create({
  containerHorizontal: {
    flexDirection: 'column',
    gap: 2,
  },
  containerVertical: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  barHorizontal: {
    height: 4,
    borderRadius: 2,
  },
  barVertical: {
    width: 3,
    borderRadius: 1.5,
    minHeight: 2,
  },
});

export default SpheresBarChart;

