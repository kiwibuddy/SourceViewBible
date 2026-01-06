import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

// Placeholder word cloud data
const WORD_CLOUD = [
  { word: 'God', count: 250, size: 32 },
  { word: 'Lord', count: 180, size: 28 },
  { word: 'said', count: 150, size: 26 },
  { word: 'people', count: 120, size: 24 },
  { word: 'Israel', count: 100, size: 22 },
  { word: 'land', count: 90, size: 20 },
  { word: 'son', count: 85, size: 20 },
  { word: 'king', count: 80, size: 18 },
  { word: 'day', count: 75, size: 18 },
  { word: 'house', count: 70, size: 16 },
  { word: 'man', count: 65, size: 16 },
  { word: 'came', count: 60, size: 14 },
];

export default function BookWordsScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

  return (
    <>
      <Stack.Screen options={{ title: 'Words' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Word Cloud</Text>
          <Text style={styles.headerText}>
            Most frequent words in this book
          </Text>
        </View>

        <View style={styles.wordCloud}>
          {WORD_CLOUD.map((item, index) => (
            <Text
              key={item.word}
              style={[
                styles.word,
                { fontSize: item.size },
                index % 3 === 0 && { color: '#6366f1' },
                index % 3 === 1 && { color: '#10b981' },
                index % 3 === 2 && { color: '#f59e0b' },
              ]}
            >
              {item.word}
            </Text>
          ))}
        </View>

        <View style={styles.list}>
          {WORD_CLOUD.map((item) => (
            <View key={item.word} style={styles.listItem}>
              <Text style={styles.listWord}>{item.word}</Text>
              <Text style={styles.listCount}>{item.count}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  headerText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  wordCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    marginBottom: 24,
  },
  word: {
    fontWeight: '600',
  },
  list: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  listWord: {
    fontSize: 16,
    color: '#fff',
  },
  listCount: {
    fontSize: 16,
    color: '#64748b',
  },
});

