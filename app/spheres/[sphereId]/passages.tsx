import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Placeholder passage data
const PASSAGES = [
  { id: 1, title: 'The Creation of Family', reference: 'Genesis 2:18-25', section: 'Foundation' },
  { id: 2, title: 'Honor Your Parents', reference: 'Exodus 20:12', section: 'Commands' },
  { id: 3, title: 'Children as a Blessing', reference: 'Psalm 127:3-5', section: 'Wisdom' },
  { id: 4, title: 'Marriage Instructions', reference: 'Ephesians 5:22-33', section: 'Teaching' },
  { id: 5, title: 'Training Children', reference: 'Proverbs 22:6', section: 'Wisdom' },
];

export default function SpherePassagesScreen() {
  const { sphereId } = useLocalSearchParams<{ sphereId: string }>();

  return (
    <>
      <Stack.Screen options={{ title: 'Key Passages' }} />
      <View style={styles.container}>
        <FlatList
          data={PASSAGES}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.passageItem}>
              <View style={styles.passageInfo}>
                <Text style={styles.passageTitle}>{item.title}</Text>
                <Text style={styles.passageReference}>{item.reference}</Text>
                <Text style={styles.passageSection}>{item.section}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
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
  passageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
  },
  passageInfo: {
    flex: 1,
  },
  passageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  passageReference: {
    fontSize: 14,
    color: '#6366f1',
    marginBottom: 4,
  },
  passageSection: {
    fontSize: 12,
    color: '#64748b',
  },
  separator: {
    height: 8,
  },
});

