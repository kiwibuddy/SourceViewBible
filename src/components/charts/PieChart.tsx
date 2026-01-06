import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { Colors } from '../../common/colors';

interface PieChartData {
  value: number;
  color: string;
  label?: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  innerRadius?: number;
  style?: ViewStyle;
  showLabels?: boolean;
}

/**
 * PieChart Component
 * 
 * Displays data as a pie/donut chart.
 * Migrated from legacy/App/js/Components/Charts/PieChart.js
 */
export function PieChart({
  data,
  size = 200,
  innerRadius = 0,
  style,
  showLabels = false,
}: PieChartProps) {
  const radius = size / 2;
  const center = size / 2;
  
  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Text style={styles.emptyText}>No data</Text>
      </View>
    );
  }

  // Generate pie slices
  let currentAngle = -90; // Start from top
  const slices = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    let d: string;
    if (innerRadius > 0) {
      // Donut chart
      const ix1 = center + innerRadius * Math.cos(startRad);
      const iy1 = center + innerRadius * Math.sin(startRad);
      const ix2 = center + innerRadius * Math.cos(endRad);
      const iy2 = center + innerRadius * Math.sin(endRad);

      d = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${ix2} ${iy2}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}`,
        'Z',
      ].join(' ');
    } else {
      // Pie chart
      d = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');
    }

    return (
      <Path
        key={index}
        d={d}
        fill={item.color}
      />
    );
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <G>{slices}</G>
      </Svg>
      {showLabels && (
        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label || `Item ${index + 1}`}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  legend: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});

export default PieChart;

