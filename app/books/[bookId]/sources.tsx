import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Placeholder data
const BOOK_SOURCES = [
  { id: 1, name: 'God', role: 'Divine', wordCount: 2500 },
  { id: 2, name: 'Narrator', role: 'Narrator', wordCount: 15000 },
  { id: 3, name: 'Moses', role: 'Lead', wordCount: 1200 },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Divine': return '#f59e0b';
    case 'Lead': return '#3b82f6';
    case 'Support': return '#10b981';
    case 'Narrator': return '#8b5cf6';
    default: return '#64748b';
  }
};

export default function BookSourcesScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

  return (
    <>
      <Stack.Screen options={{ title: 'Sources' }} />
      <View style={styles.container}>
        <FlatList
          data={BOOK_SOURCES}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.sourceItem}>
              <View style={[styles.sourceIcon, { backgroundColor: getRoleColor(item.role) }]}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
              <View style={styles.sourceInfo}>
                <Text style={styles.sourceName}>{item.name}</Text>
                <Text style={styles.sourceMeta}>
                  {item.role} · {item.wordCount.toLocaleString()} words
                </Text>
              </View>
            </TouchableOpacity>
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
  list: {
    padding: 16,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
  },
  sourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  sourceMeta: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  separator: {
    height: 8,
  },
});

