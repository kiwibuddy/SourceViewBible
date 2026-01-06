import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DiscoverScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>SourceView Bible</Text>
        <Text style={styles.subtitle}>Discover the Bible through Sources and Spheres</Text>
      </View>

      <View style={styles.cardsContainer}>
        <Link href="/books" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: '#3b82f6' }]}>
              <Ionicons name="book" size={32} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Books</Text>
            <Text style={styles.cardDescription}>
              Explore all 66 books of the Bible
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/sources" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: '#10b981' }]}>
              <Ionicons name="people" size={32} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Sources</Text>
            <Text style={styles.cardDescription}>
              Discover who speaks in Scripture
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/spheres" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: '#8b5cf6' }]}>
              <Ionicons name="globe" size={32} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Spheres</Text>
            <Text style={styles.cardDescription}>
              Explore thematic categories
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/discovery-center" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: '#f59e0b' }]}>
              <Ionicons name="analytics" size={32} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Discovery Center</Text>
            <Text style={styles.cardDescription}>
              Explore patterns and insights
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/about" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: '#64748b' }]}>
              <Ionicons name="information-circle" size={32} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>About</Text>
            <Text style={styles.cardDescription}>
              Learn about SourceView Bible
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>NLT - New Living Translation</Text>
      </View>
    </ScrollView>
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
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
});

