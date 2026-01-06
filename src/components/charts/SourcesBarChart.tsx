/**
 * SourcesBarChart Component
 * 
 * Bar chart showing source type distribution (narrator, god, lead, support).
 * Ported from legacy/App/js/Components/Charts/SourcesBarChart.js
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, SourceType } from '../../common/colors';

interface SourceData {
  narrator?: number;
  god?: number;
  lead?: number;
  support?: number;
}

interface SourcesBarChartProps {
  data: SourceData[];
  horizontal?: boolean;
  style?: ViewStyle;
  barStyle?: ViewStyle;
}

export function SourcesBarChart({
  data,
  horizontal = true,
  style,
  barStyle,
}: SourcesBarChartProps) {
  const sourceTypes = [
    SourceType.NARRATOR,
    SourceType.GOD,
    SourceType.LEAD,
    SourceType.SUPPORT,
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
    return sourceTypes.map((type, index) => {
      const item = data[index] || {};
      const value = item[type as keyof SourceData] || 0;
      const percentage = (value / maxValue) * 100;
      const color = Colors.sources[type].tint;

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

export default SourcesBarChart;

