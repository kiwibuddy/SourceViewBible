import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

// Placeholder book data - will be loaded from Realm database
const BOOKS = [
  { id: 'gen', name: 'Genesis', testament: 'Old Testament', chapters: 50 },
  { id: 'exod', name: 'Exodus', testament: 'Old Testament', chapters: 40 },
  { id: 'lev', name: 'Leviticus', testament: 'Old Testament', chapters: 27 },
  { id: 'num', name: 'Numbers', testament: 'Old Testament', chapters: 36 },
  { id: 'deut', name: 'Deuteronomy', testament: 'Old Testament', chapters: 34 },
  { id: 'josh', name: 'Joshua', testament: 'Old Testament', chapters: 24 },
  { id: 'judg', name: 'Judges', testament: 'Old Testament', chapters: 21 },
  { id: 'ruth', name: 'Ruth', testament: 'Old Testament', chapters: 4 },
  { id: 'matt', name: 'Matthew', testament: 'New Testament', chapters: 28 },
  { id: 'mark', name: 'Mark', testament: 'New Testament', chapters: 16 },
  { id: 'luke', name: 'Luke', testament: 'New Testament', chapters: 24 },
  { id: 'john', name: 'John', testament: 'New Testament', chapters: 21 },
  { id: 'acts', name: 'Acts', testament: 'New Testament', chapters: 28 },
  { id: 'rom', name: 'Romans', testament: 'New Testament', chapters: 16 },
  { id: 'rev', name: 'Revelation', testament: 'New Testament', chapters: 22 },
];

type Book = {
  id: string;
  name: string;
  testament: string;
  chapters: number;
};

export default function BooksScreen() {
  const renderBook = ({ item }: { item: Book }) => (
    <Link href={`/reader/${item.id}`} asChild>
      <TouchableOpacity style={styles.bookItem}>
        <View style={styles.bookInfo}>
          <Text style={styles.bookName}>{item.name}</Text>
          <Text style={styles.bookMeta}>
            {item.chapters} chapters · {item.testament}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={BOOKS}
        keyExtractor={(item) => item.id}
        renderItem={renderBook}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  listContent: {
    padding: 16,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  bookMeta: {
    fontSize: 14,
    color: '#64748b',
  },
  chevron: {
    fontSize: 24,
    color: '#64748b',
  },
  separator: {
    height: 8,
  },
});

