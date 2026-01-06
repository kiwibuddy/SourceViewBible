import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

// Placeholder - will be replaced with actual Bible text from Emdros database
const SAMPLE_TEXT = `In the beginning God created the heavens and the earth. The earth was formless and empty, and darkness covered the deep waters. And the Spirit of God was hovering over the surface of the waters.

Then God said, "Let there be light," and there was light. And God saw that the light was good. Then he separated the light from the darkness. God called the light "day" and the darkness "night."

And evening passed and morning came, marking the first day.

Then God said, "Let there be a space between the waters, to separate the waters of the heavens from the waters of the earth." And that is what happened. God made this space to separate the waters of the earth from the waters of the heavens. God called the space "sky."

And evening passed and morning came, marking the second day.`;

const BOOK_NAMES: { [key: string]: string } = {
  gen: 'Genesis',
  exod: 'Exodus',
  lev: 'Leviticus',
  num: 'Numbers',
  deut: 'Deuteronomy',
  josh: 'Joshua',
  judg: 'Judges',
  ruth: 'Ruth',
  matt: 'Matthew',
  mark: 'Mark',
  luke: 'Luke',
  john: 'John',
  acts: 'Acts',
  rom: 'Romans',
  rev: 'Revelation',
};

export default function ReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const bookName = BOOK_NAMES[bookId || 'gen'] || 'Genesis';

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: bookName,
          headerBackTitle: 'Books',
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.bookTitle}>{bookName}</Text>
          <Text style={styles.chapterTitle}>Chapter 1</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.verseNumber}>1 </Text>
          <Text style={styles.bibleText}>{SAMPLE_TEXT}</Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Bible text will be loaded from the Emdros database.
            {'\n\n'}
            The reader will support:
            {'\n'}• Source highlighting (who is speaking)
            {'\n'}• Sphere highlighting (thematic categories)
            {'\n'}• Word tap for definitions
            {'\n'}• Chapter/verse navigation
          </Text>
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
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
    paddingBottom: 16,
  },
  bookTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 16,
    color: '#64748b',
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  verseNumber: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '700',
    marginRight: 4,
  },
  bibleText: {
    fontSize: 18,
    lineHeight: 32,
    color: '#e2e8f0',
    fontFamily: 'System',
  },
  placeholder: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  placeholderText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
});

