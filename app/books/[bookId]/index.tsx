import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BOOK_DATA: Record<string, { name: string; chapters: number; wordCount: number; testament: string }> = {
  gen: { name: 'Genesis', chapters: 50, wordCount: 38262, testament: 'Old Testament' },
  exod: { name: 'Exodus', chapters: 40, wordCount: 32692, testament: 'Old Testament' },
  matt: { name: 'Matthew', chapters: 28, wordCount: 23684, testament: 'New Testament' },
  john: { name: 'John', chapters: 21, wordCount: 19099, testament: 'New Testament' },
};

export default function BookOverviewScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const book = BOOK_DATA[bookId || 'gen'] || BOOK_DATA.gen;

  return (
    <>
      <Stack.Screen options={{ title: book.name }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.bookTitle}>{book.name}</Text>
          <Text style={styles.testament}>{book.testament}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.chapters}</Text>
            <Text style={styles.statLabel}>Chapters</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.wordCount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Link href={`/reader/${bookId}`} asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="book-outline" size={24} color="#6366f1" />
              <Text style={styles.actionText}>Read</Text>
            </TouchableOpacity>
          </Link>

          <Link href={`/books/${bookId}/chapters`} asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="list-outline" size={24} color="#6366f1" />
              <Text style={styles.actionText}>Chapters</Text>
            </TouchableOpacity>
          </Link>

          <Link href={`/books/${bookId}/sources`} asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="people-outline" size={24} color="#6366f1" />
              <Text style={styles.actionText}>Sources</Text>
            </TouchableOpacity>
          </Link>

          <Link href={`/books/${bookId}/spheres`} asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="globe-outline" size={24} color="#6366f1" />
              <Text style={styles.actionText}>Spheres</Text>
            </TouchableOpacity>
          </Link>

          <Link href={`/books/${bookId}/words`} asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="text-outline" size={24} color="#6366f1" />
              <Text style={styles.actionText}>Words</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.overview}>
          <Text style={styles.overviewTitle}>Overview</Text>
          <Text style={styles.overviewText}>
            Book overview content will be loaded from the Realm database.
            This section contains introductory information about the book,
            its author, historical context, and key themes.
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
    alignItems: 'center',
    marginBottom: 24,
  },
  bookTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  testament: {
    fontSize: 16,
    color: '#64748b',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 48,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  actions: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  overview: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 12,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  overviewText: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 26,
  },
});

