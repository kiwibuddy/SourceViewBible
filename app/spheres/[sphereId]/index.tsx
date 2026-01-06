import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SPHERES: Record<string, { name: string; color: string; wordCount: number; description: string }> = {
  family: { 
    name: 'Family', 
    color: '#ef4444', 
    wordCount: 45000,
    description: 'Marriage, parenting, and household relationships' 
  },
  economics: { 
    name: 'Economics', 
    color: '#f59e0b', 
    wordCount: 38000,
    description: 'Work, money, resources, and stewardship' 
  },
  government: { 
    name: 'Government', 
    color: '#3b82f6', 
    wordCount: 52000,
    description: 'Law, justice, authority, and civic life' 
  },
  religion: { 
    name: 'Religion', 
    color: '#8b5cf6', 
    wordCount: 120000,
    description: 'Worship, prayer, faith, and spiritual practices' 
  },
  education: { 
    name: 'Education', 
    color: '#10b981', 
    wordCount: 32000,
    description: 'Teaching, learning, wisdom, and knowledge' 
  },
  communication: { 
    name: 'Communication', 
    color: '#06b6d4', 
    wordCount: 28000,
    description: 'Speech, writing, media, and arts' 
  },
  celebration: { 
    name: 'Celebration', 
    color: '#ec4899', 
    wordCount: 25000,
    description: 'Festivals, rest, joy, and community gatherings' 
  },
};

export default function SphereDetailScreen() {
  const { sphereId } = useLocalSearchParams<{ sphereId: string }>();
  const sphere = SPHERES[sphereId || 'family'] || SPHERES.family;

  return (
    <>
      <Stack.Screen options={{ title: sphere.name }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={[styles.icon, { backgroundColor: sphere.color }]}>
            <Ionicons name="globe" size={48} color="#fff" />
          </View>
          <Text style={styles.name}>{sphere.name}</Text>
          <Text style={styles.description}>{sphere.description}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: sphere.color }]}>
              {sphere.wordCount.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Link href={`/spheres/${sphereId}/passages`} asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text-outline" size={24} color={sphere.color} />
              <Text style={styles.actionText}>Key Passages</Text>
            </TouchableOpacity>
          </Link>

          <Link href={`/spheres/${sphereId}/books`} asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="book-outline" size={24} color={sphere.color} />
              <Text style={styles.actionText}>Books</Text>
            </TouchableOpacity>
          </Link>

          <Link href={`/spheres/${sphereId}/sources`} asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="people-outline" size={24} color={sphere.color} />
              <Text style={styles.actionText}>Sources</Text>
            </TouchableOpacity>
          </Link>

          <Link href={`/spheres/${sphereId}/words`} asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="text-outline" size={24} color={sphere.color} />
              <Text style={styles.actionText}>Words</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.overview}>
          <Text style={styles.overviewTitle}>Overview</Text>
          <Text style={styles.overviewText}>
            Sphere overview content will be loaded from the Realm database.
            This section contains information about what the Bible teaches
            about this sphere of life and society.
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
  icon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  stats: {
    alignItems: 'center',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  actions: {
    gap: 12,
    marginBottom: 24,
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

