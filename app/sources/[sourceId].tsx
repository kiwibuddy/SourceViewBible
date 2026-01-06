import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SOURCES: Record<string, { name: string; role: string; wordCount: number; books: number }> = {
  '1': { name: 'God', role: 'Divine', wordCount: 25000, books: 45 },
  '2': { name: 'Jesus', role: 'Divine', wordCount: 18000, books: 4 },
  '3': { name: 'Moses', role: 'Lead', wordCount: 12000, books: 5 },
  '4': { name: 'Paul', role: 'Lead', wordCount: 15000, books: 13 },
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

export default function SourceDetailScreen() {
  const { sourceId } = useLocalSearchParams<{ sourceId: string }>();
  const source = SOURCES[sourceId || '1'] || SOURCES['1'];
  const roleColor = getRoleColor(source.role);

  return (
    <>
      <Stack.Screen options={{ title: source.name }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: roleColor }]}>
            <Ionicons name="person" size={48} color="#fff" />
          </View>
          <Text style={styles.name}>{source.name}</Text>
          <Text style={[styles.role, { color: roleColor }]}>{source.role}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{source.wordCount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{source.books}</Text>
            <Text style={styles.statLabel}>Books</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="book-outline" size={24} color="#6366f1" />
            <Text style={styles.actionText}>View in Books</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubbles-outline" size={24} color="#6366f1" />
            <Text style={styles.actionText}>Conversations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="globe-outline" size={24} color="#6366f1" />
            <Text style={styles.actionText}>Spheres</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="text-outline" size={24} color="#6366f1" />
            <Text style={styles.actionText}>Words</Text>
          </TouchableOpacity>
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
    marginBottom: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  role: {
    fontSize: 18,
    fontWeight: '500',
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
});

