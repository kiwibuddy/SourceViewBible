import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SPHERES = [
  { id: 'family', name: 'Family', color: '#ef4444', wordCount: 450 },
  { id: 'economics', name: 'Economics', color: '#f59e0b', wordCount: 380 },
  { id: 'government', name: 'Government', color: '#3b82f6', wordCount: 520 },
  { id: 'religion', name: 'Religion', color: '#8b5cf6', wordCount: 1200 },
  { id: 'education', name: 'Education', color: '#10b981', wordCount: 320 },
  { id: 'communication', name: 'Communication', color: '#06b6d4', wordCount: 280 },
  { id: 'celebration', name: 'Celebration', color: '#ec4899', wordCount: 250 },
];

export default function BookSpheresScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

  return (
    <>
      <Stack.Screen options={{ title: 'Spheres' }} />
      <View style={styles.container}>
        <FlatList
          data={SPHERES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.sphereItem}>
              <View style={[styles.sphereBar, { backgroundColor: item.color }]} />
              <View style={styles.sphereInfo}>
                <Text style={styles.sphereName}>{item.name}</Text>
                <Text style={styles.sphereMeta}>
                  {item.wordCount.toLocaleString()} words
                </Text>
              </View>
              <View style={[styles.sphereIndicator, { backgroundColor: item.color }]}>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
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
  sphereItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sphereBar: {
    width: 6,
    height: '100%',
  },
  sphereInfo: {
    flex: 1,
    padding: 16,
  },
  sphereName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  sphereMeta: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  sphereIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  separator: {
    height: 8,
  },
});

