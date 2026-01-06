import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../common/colors';

interface BarChartData {
  value: number;
  label: string;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  barWidth?: number;
  spacing?: number;
  style?: ViewStyle;
  horizontal?: boolean;
  showValues?: boolean;
}

/**
 * BarChart Component
 * 
 * Displays data as a bar chart.
 * Migrated from legacy/App/js/Components/Charts/BarChart.js
 */
export function BarChart({
  data,
  height = 200,
  barWidth = 40,
  spacing = 8,
  style,
  horizontal = false,
  showValues = true,
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  if (horizontal) {
    return (
      <View style={[styles.horizontalContainer, style]}>
        {data.map((item, index) => {
          const widthPercent = (item.value / maxValue) * 100;
          return (
            <View key={index} style={styles.horizontalBarContainer}>
              <Text style={styles.horizontalLabel} numberOfLines={1}>
                {item.label}
              </Text>
              <View style={styles.horizontalBarWrapper}>
                <View
                  style={[
                    styles.horizontalBar,
                    {
                      width: `${widthPercent}%`,
                      backgroundColor: item.color || Colors.primary,
                    },
                  ]}
                />
                {showValues && (
                  <Text style={styles.horizontalValue}>{item.value}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  const chartWidth = data.length * (barWidth + spacing) - spacing;

  return (
    <View style={[styles.container, { height }, style]}>
      <View style={[styles.barsContainer, { width: chartWidth }]}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          return (
            <View
              key={index}
              style={[styles.barWrapper, { width: barWidth, marginRight: index < data.length - 1 ? spacing : 0 }]}
            >
              {showValues && (
                <Text style={styles.value}>{item.value}</Text>
              )}
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: item.color || Colors.primary,
                  },
                ]}
              />
              <Text style={styles.label} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  value: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  horizontalContainer: {
    width: '100%',
  },
  horizontalBarContainer: {
    marginBottom: 12,
  },
  horizontalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  horizontalBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  horizontalBar: {
    height: '100%',
    borderRadius: 4,
  },
  horizontalValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
});

export default BarChart;

