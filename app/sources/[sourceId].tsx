/**
 * Source Overview Screen
 * 
 * Shows source (speaker) statistics and information.
 * Ported from legacy/App/js/Scenes/Sources/SourceOverview.js
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, formatNumber } from '../../src/common';
import { SourceIcon, SpheresBarChart } from '../../src/components';

// Mock data - will be replaced with real Realm data
const MOCK_SOURCE_DATA: Record<string, any> = {
  '1': {
    id: 1,
    name: 'God',
    wordCount: 35000,
    principalSourceType: 'god',
    isDivine: true,
    sphereWordCount: 18000,
    bookCount: 55,
    sphereCounts: { family: 3500, economics: 2800, government: 4200, religion: 12000, education: 1500, communication: 2000, celebration: 1000 },
    topBooks: [
      { id: 'exodus', name: 'Exodus', wordCount: 15000 },
      { id: 'leviticus', name: 'Leviticus', wordCount: 18000 },
      { id: 'deuteronomy', name: 'Deuteronomy', wordCount: 3000 },
    ],
  },
  '2': {
    id: 2,
    name: 'Jesus',
    wordCount: 32000,
    principalSourceType: 'god',
    isDivine: true,
    sphereWordCount: 16500,
    bookCount: 4,
    sphereCounts: { family: 4000, economics: 3200, government: 2800, religion: 8000, education: 2500, communication: 2000, celebration: 1500 },
    topBooks: [
      { id: 'matthew', name: 'Matthew', wordCount: 13000 },
      { id: 'john', name: 'John', wordCount: 11000 },
      { id: 'luke', name: 'Luke', wordCount: 9500 },
    ],
  },
};

export default function SourceOverviewScreen() {
  const { sourceId } = useLocalSearchParams<{ sourceId: string }>();
  const router = useRouter();

  const source = MOCK_SOURCE_DATA[sourceId || '1'] || MOCK_SOURCE_DATA['1'];
  const spherePercent = Math.round((source.sphereWordCount / source.wordCount) * 100);
  const sourceColors = Colors.sources[source.principalSourceType as keyof typeof Colors.sources] || Colors.sources.other;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={sourceColors.gradient.big as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SourceIcon
          source={source}
          principalSourceType={source.principalSourceType}
          size={80}
          showBackground={false}
        />
        <Text style={styles.headerName}>{source.name}</Text>
        <Text style={styles.headerSubtitle}>
          {formatNumber(source.wordCount)} words
        </Text>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{source.bookCount}</Text>
          <Text style={styles.statLabel}>Books</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{spherePercent}%</Text>
          <Text style={styles.statLabel}>Spheres</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatNumber(source.wordCount)}</Text>
          <Text style={styles.statLabel}>Words</Text>
        </View>
      </View>

      {/* Top Books */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TOP BOOKS</Text>
        {source.topBooks.map((book: any) => (
          <TouchableOpacity
            key={book.id}
            style={styles.bookItem}
            onPress={() => router.push(`/books/${book.id}`)}
          >
            <Text style={styles.bookName}>{book.name}</Text>
            <Text style={styles.bookStats}>{formatNumber(book.wordCount)} words</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sphere Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SPHERE DISTRIBUTION</Text>
        <View style={styles.sphereGrid}>
          {Object.entries(source.sphereCounts).map(([sphere, count]) => {
            const sphereColors = Colors.spheres[sphere as keyof typeof Colors.spheres];
            if (!sphereColors) return null;
            const percent = Math.round((count as number / source.sphereWordCount) * 100);
            return (
              <View key={sphere} style={styles.sphereItem}>
                <View style={[styles.sphereDot, { backgroundColor: sphereColors.tint }]} />
                <Text style={styles.sphereName}>{sphere.charAt(0).toUpperCase() + sphere.slice(1)}</Text>
                <Text style={styles.spherePercent}>{percent}%</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 15,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.tint,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.subtitle,
    marginTop: 2,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.subtitle,
    letterSpacing: 1,
    marginBottom: 12,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  bookName: {
    flex: 1,
    fontSize: 17,
    color: Colors.text,
  },
  bookStats: {
    fontSize: 14,
    color: Colors.subtitle,
    marginRight: 10,
  },
  arrow: {
    fontSize: 22,
    color: Colors.separator,
  },
  sphereGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sphereItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sphereDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  sphereName: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  spherePercent: {
    fontSize: 14,
    color: Colors.subtitle,
    marginRight: 10,
  },
});
