/**
 * PieChart Component
 * 
 * Simple pie chart using SVG for data visualization.
 * Ported from legacy/App/js/Components/Charts/PieChart.js
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';

interface Slice {
  value: number;
  color: string;
  label?: string;
}

interface PieChartProps {
  data: Slice[];
  size?: number;
  innerRadius?: number;
  style?: ViewStyle;
}

export function PieChart({
  data,
  size = 100,
  innerRadius = 0,
  style,
}: PieChartProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  if (total === 0) return null;

  const radius = size / 2;
  const center = size / 2;

  // Calculate paths for each slice
  let currentAngle = -Math.PI / 2; // Start from top
  const paths = data.map((slice, index) => {
    const sliceAngle = (slice.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    // Calculate arc points
    const startX = center + radius * Math.cos(startAngle);
    const startY = center + radius * Math.sin(startAngle);
    const endX = center + radius * Math.cos(endAngle);
    const endY = center + radius * Math.sin(endAngle);

    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

    let pathD = '';
    if (innerRadius > 0) {
      // Donut chart
      const innerStartX = center + innerRadius * Math.cos(startAngle);
      const innerStartY = center + innerRadius * Math.sin(startAngle);
      const innerEndX = center + innerRadius * Math.cos(endAngle);
      const innerEndY = center + innerRadius * Math.sin(endAngle);

      pathD = `
        M ${startX} ${startY}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
        L ${innerEndX} ${innerEndY}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
        Z
      `;
    } else {
      // Pie chart
      pathD = `
        M ${center} ${center}
        L ${startX} ${startY}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
        Z
      `;
    }

    return (
      <Path
        key={index}
        d={pathD}
        fill={slice.color}
      />
    );
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <G>{paths}</G>
        {innerRadius > 0 && (
          <Circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="white"
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PieChart;
