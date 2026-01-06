import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Placeholder source data - will be loaded from Realm database
const SOURCES = [
  { id: 1, name: 'God', role: 'Divine', wordCount: 25000, icon: 'flash' },
  { id: 2, name: 'Jesus', role: 'Divine', wordCount: 18000, icon: 'flash' },
  { id: 3, name: 'Moses', role: 'Lead', wordCount: 12000, icon: 'person' },
  { id: 4, name: 'Paul', role: 'Lead', wordCount: 15000, icon: 'person' },
  { id: 5, name: 'David', role: 'Lead', wordCount: 8000, icon: 'person' },
  { id: 6, name: 'Peter', role: 'Support', wordCount: 4000, icon: 'person' },
  { id: 7, name: 'Isaiah', role: 'Lead', wordCount: 7000, icon: 'person' },
  { id: 8, name: 'Narrator', role: 'Narrator', wordCount: 200000, icon: 'book' },
];

type Source = {
  id: number;
  name: string;
  role: string;
  wordCount: number;
  icon: string;
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Divine': return '#f59e0b';
    case 'Lead': return '#3b82f6';
    case 'Support': return '#10b981';
    case 'Narrator': return '#8b5cf6';
    default: return '#64748b';
  }
};

export default function SourcesScreen() {
  const renderSource = ({ item }: { item: Source }) => (
    <TouchableOpacity style={styles.sourceItem}>
      <View style={[styles.sourceIcon, { backgroundColor: getRoleColor(item.role) }]}>
        <Ionicons name={item.icon as any} size={24} color="#fff" />
      </View>
      <View style={styles.sourceInfo}>
        <Text style={styles.sourceName}>{item.name}</Text>
        <Text style={styles.sourceMeta}>
          {item.role} · {item.wordCount.toLocaleString()} words
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Explore who speaks in the Bible and what they say
        </Text>
      </View>
      <FlatList
        data={SOURCES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSource}
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  headerText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
  },
  sourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sourceInfo: {
    flex: 1,
  },
  sourceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  sourceMeta: {
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

