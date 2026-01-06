import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';

const BOOK_CHAPTERS: Record<string, number> = {
  gen: 50, exod: 40, lev: 27, num: 36, deut: 34,
  matt: 28, mark: 16, luke: 24, john: 21, acts: 28,
};

export default function BookChaptersScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const chapterCount = BOOK_CHAPTERS[bookId || 'gen'] || 50;
  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

  return (
    <>
      <Stack.Screen options={{ title: 'Chapters' }} />
      <View style={styles.container}>
        <FlatList
          data={chapters}
          numColumns={5}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <Link href={`/reader/${bookId}?chapter=${item}`} asChild>
              <TouchableOpacity style={styles.chapterButton}>
                <Text style={styles.chapterText}>{item}</Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  grid: {
    padding: 16,
  },
  chapterButton: {
    flex: 1,
    aspectRatio: 1,
    margin: 6,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '18%',
  },
  chapterText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

