import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors } from '../../common/colors';

interface WordCloudData {
  word: string;
  count: number;
}

interface WordCloudProps {
  data: WordCloudData[];
  style?: ViewStyle;
  onWordPress?: (word: string) => void;
  maxWords?: number;
  minFontSize?: number;
  maxFontSize?: number;
}

const COLORS = [
  Colors.primary,
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#3b82f6',
];

/**
 * WordCloud Component
 * 
 * Displays words sized by frequency.
 * Migrated from legacy/App/js/Components/Charts/WordCloud.js
 */
export function WordCloud({
  data,
  style,
  onWordPress,
  maxWords = 50,
  minFontSize = 12,
  maxFontSize = 32,
}: WordCloudProps) {
  // Sort by count and take top words
  const sortedData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, maxWords);

  if (sortedData.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.emptyText}>No words available</Text>
      </View>
    );
  }

  const maxCount = sortedData[0].count;
  const minCount = sortedData[sortedData.length - 1].count;
  const range = maxCount - minCount || 1;

  return (
    <View style={[styles.container, style]}>
      {sortedData.map((item, index) => {
        // Calculate font size based on count
        const normalized = (item.count - minCount) / range;
        const fontSize = minFontSize + normalized * (maxFontSize - minFontSize);
        const color = COLORS[index % COLORS.length];

        return (
          <TouchableOpacity
            key={item.word}
            onPress={() => onWordPress?.(item.word)}
            disabled={!onWordPress}
            style={styles.wordWrapper}
          >
            <Text style={[styles.word, { fontSize, color }]}>
              {item.word}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  wordWrapper: {
    padding: 4,
  },
  word: {
    fontWeight: '600',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});

export default WordCloud;

