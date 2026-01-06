import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// The 7 Spheres from the original app
const SPHERES = [
  { 
    id: 'family', 
    name: 'Family', 
    color: '#ef4444',
    icon: 'heart',
    description: 'Marriage, parenting, and household relationships',
    wordCount: 45000,
  },
  { 
    id: 'economics', 
    name: 'Economics', 
    color: '#f59e0b',
    icon: 'cash',
    description: 'Work, money, resources, and stewardship',
    wordCount: 38000,
  },
  { 
    id: 'government', 
    name: 'Government', 
    color: '#3b82f6',
    icon: 'flag',
    description: 'Law, justice, authority, and civic life',
    wordCount: 52000,
  },
  { 
    id: 'religion', 
    name: 'Religion', 
    color: '#8b5cf6',
    icon: 'flame',
    description: 'Worship, prayer, faith, and spiritual practices',
    wordCount: 120000,
  },
  { 
    id: 'education', 
    name: 'Education', 
    color: '#10b981',
    icon: 'school',
    description: 'Teaching, learning, wisdom, and knowledge',
    wordCount: 32000,
  },
  { 
    id: 'communication', 
    name: 'Communication', 
    color: '#06b6d4',
    icon: 'megaphone',
    description: 'Speech, writing, media, and arts',
    wordCount: 28000,
  },
  { 
    id: 'celebration', 
    name: 'Celebration', 
    color: '#ec4899',
    icon: 'musical-notes',
    description: 'Festivals, rest, joy, and community gatherings',
    wordCount: 25000,
  },
];

type Sphere = {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  wordCount: number;
};

export default function SpheresScreen() {
  const renderSphere = ({ item }: { item: Sphere }) => (
    <TouchableOpacity style={styles.sphereItem}>
      <View style={[styles.sphereIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon as any} size={28} color="#fff" />
      </View>
      <View style={styles.sphereInfo}>
        <Text style={styles.sphereName}>{item.name}</Text>
        <Text style={styles.sphereDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.sphereMeta}>
          {item.wordCount.toLocaleString()} words
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>7 Spheres of Society</Text>
        <Text style={styles.headerText}>
          Discover what the Bible says about each sphere of life
        </Text>
      </View>
      <FlatList
        data={SPHERES}
        keyExtractor={(item) => item.id}
        renderItem={renderSphere}
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  headerText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  sphereItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
  },
  sphereIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sphereInfo: {
    flex: 1,
  },
  sphereName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  sphereDescription: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 4,
  },
  sphereMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  chevron: {
    fontSize: 24,
    color: '#64748b',
  },
  separator: {
    height: 12,
  },
});

