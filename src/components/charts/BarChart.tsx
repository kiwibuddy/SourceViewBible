/**
 * BarChart Component
 * 
 * Horizontal or vertical bar chart for statistics display.
 * Ported from legacy/App/js/Components/Charts/BarChart.js
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface Bar {
  color: string;
  value: number;
}

interface BarChartProps {
  bars: Bar[];
  maxChartValue?: number;
  horizontal?: boolean;
  style?: ViewStyle;
  barStyle?: ViewStyle;
  deltaStyle?: ViewStyle;
}

export function BarChart({
  bars,
  maxChartValue = 100,
  horizontal = true,
  style,
  barStyle,
  deltaStyle,
}: BarChartProps) {
  const totalValue = bars.reduce((sum, bar) => sum + bar.value, 0);
  const maxValue = Math.max(maxChartValue, totalValue);

  if (horizontal) {
    return (
      <View style={[styles.containerHorizontal, style]}>
        {bars.map((bar, index) => {
          const flex = bar.value / maxValue;
          return (
            <View
              key={index}
              style={[
                styles.barHorizontal,
                { backgroundColor: bar.color, flex },
                barStyle,
              ]}
            />
          );
        })}
        <View
          style={[
            styles.deltaHorizontal,
            { flex: (maxValue - totalValue) / maxValue },
            deltaStyle,
          ]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.containerVertical, style]}>
      <View
        style={[
          styles.deltaVertical,
          { flex: (maxValue - totalValue) / maxValue },
          deltaStyle,
        ]}
      />
      {bars.map((bar, index) => {
        const flex = bar.value / maxValue;
        return (
          <View
            key={index}
            style={[
              styles.barVertical,
              { backgroundColor: bar.color, flex },
              barStyle,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  containerHorizontal: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
  },
  containerVertical: {
    flexDirection: 'column',
    width: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
  },
  barHorizontal: {
    height: '100%',
  },
  barVertical: {
    width: '100%',
  },
  deltaHorizontal: {
    height: '100%',
    backgroundColor: '#E8E8E8',
  },
  deltaVertical: {
    width: '100%',
    backgroundColor: '#E8E8E8',
  },
});

export default BarChart;
