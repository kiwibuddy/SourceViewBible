/**
 * Sphere Overview Screen
 * 
 * Shows sphere statistics, key passages, and related content.
 * Ported from legacy/App/js/Scenes/Spheres/SphereOverview.js
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
// LinearGradient removed - requires native rebuild
import { Colors, formatNumber } from '../../../src/common';
import { Icon, SourceIcon } from '../../../src/components';

// Mock data
const MOCK_SPHERE_DATA: Record<string, any> = {
  family: {
    id: 'family',
    name: 'Family',
    wordCount: 45000,
    sourceCount: 85,
    overview: 'The Family sphere encompasses all aspects of family life in Scripture, from marriage and parenting to extended family relationships and inheritance. God\'s design for the family is foundational to society and reflects His relationship with His people.',
    topBooks: [
      { id: 'genesis', name: 'Genesis', wordCount: 12000 },
      { id: 'ruth', name: 'Ruth', wordCount: 1800 },
      { id: 'proverbs', name: 'Proverbs', wordCount: 4500 },
    ],
    topSources: [
      { id: 1, name: 'Jacob', wordCount: 3200, principalSourceType: 'lead', isHuman: true, isIndividual: true, hasGender: true, isFemale: false },
      { id: 2, name: 'Abraham', wordCount: 2400, principalSourceType: 'lead', isHuman: true, isIndividual: true, hasGender: true, isFemale: false },
    ],
    passages: [
      { title: 'God Creates Marriage', reference: 'Genesis 2:18-25' },
      { title: 'Honor Your Parents', reference: 'Exodus 20:12' },
      { title: 'Train Up a Child', reference: 'Proverbs 22:6' },
    ],
  },
  religion: {
    id: 'religion',
    name: 'Religion',
    wordCount: 78000,
    sourceCount: 120,
    overview: 'The Religion sphere covers worship, sacrifice, priesthood, the temple, and humanity\'s relationship with God. This sphere reveals how God established systems for people to approach Him and maintain fellowship with the divine.',
    topBooks: [
      { id: 'leviticus', name: 'Leviticus', wordCount: 18000 },
      { id: 'psalms', name: 'Psalms', wordCount: 15000 },
      { id: 'hebrews', name: 'Hebrews', wordCount: 6000 },
    ],
    topSources: [
      { id: 1, name: 'God', wordCount: 12000, principalSourceType: 'god', isDivine: true },
      { id: 3, name: 'David', wordCount: 8000, principalSourceType: 'lead', isHuman: true, isIndividual: true, hasGender: true, isFemale: false },
    ],
    passages: [
      { title: 'The Greatest Commandment', reference: 'Deuteronomy 6:4-9' },
      { title: 'A Living Sacrifice', reference: 'Romans 12:1-2' },
      { title: 'True Worship', reference: 'John 4:23-24' },
    ],
  },
};

const DEFAULT_SPHERE_DATA = {
  id: 'unknown',
  name: 'Sphere',
  wordCount: 10000,
  sourceCount: 20,
  overview: 'Sphere overview will be loaded from the database.',
  topBooks: [],
  topSources: [],
  passages: [],
};

const TOTAL_BIBLE_WORD_COUNT = 783137;

export default function SphereOverviewScreen() {
  const { sphereId } = useLocalSearchParams<{ sphereId: string }>();
  const router = useRouter();

  const sphere = MOCK_SPHERE_DATA[sphereId || ''] || { ...DEFAULT_SPHERE_DATA, name: sphereId || 'Sphere', id: sphereId };
  const sphereColors = Colors.spheres[sphere.id as keyof typeof Colors.spheres] || Colors.spheres.foundational;
  const percent = Math.round((sphere.wordCount / TOTAL_BIBLE_WORD_COUNT) * 100);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: sphereColors.tint }]}>
        <Icon
          name={`${sphere.id}-filled`}
          size={60}
          color="#FFFFFF"
        />
        <Text style={styles.headerName}>{sphere.name}</Text>
        <Text style={styles.headerSubtitle}>
          {percent}% of the Bible
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: sphereColors.tint }]}>{sphere.sourceCount}</Text>
          <Text style={styles.statLabel}>Sources</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: sphereColors.tint }]}>{formatNumber(sphere.wordCount)}</Text>
          <Text style={styles.statLabel}>Words</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: sphereColors.tint }]}>52</Text>
          <Text style={styles.statLabel}>Key Passages</Text>
        </View>
      </View>

      {/* Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OVERVIEW</Text>
        <Text style={styles.overviewText}>{sphere.overview}</Text>
      </View>

      {/* Key Passages */}
      {sphere.passages.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>KEY PASSAGES</Text>
            <TouchableOpacity onPress={() => router.push(`/spheres/${sphereId}/passages`)}>
              <Text style={[styles.viewAllLink, { color: sphereColors.tint }]}>View All 52</Text>
            </TouchableOpacity>
          </View>
          {sphere.passages.map((passage: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.passageItem}
              onPress={() => router.push(`/reader/${sphereId}?passage=${index}`)}
            >
              <View style={styles.passageInfo}>
                <Text style={styles.passageTitle}>{passage.title}</Text>
                <Text style={styles.passageReference}>{passage.reference}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Top Books */}
      {sphere.topBooks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOP BOOKS</Text>
          {sphere.topBooks.map((book: any) => (
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
      )}

      {/* Top Sources */}
      {sphere.topSources.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOP SOURCES</Text>
          {sphere.topSources.map((source: any) => (
            <TouchableOpacity
              key={source.id}
              style={styles.sourceItem}
              onPress={() => router.push(`/sources/${source.id}`)}
            >
              <SourceIcon
                source={source}
                principalSourceType={source.principalSourceType}
                size={40}
              />
              <View style={styles.sourceInfo}>
                <Text style={styles.sourceName}>{source.name}</Text>
                <Text style={styles.sourceStats}>{formatNumber(source.wordCount)} words</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.subtitle,
    letterSpacing: 1,
    marginBottom: 12,
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  overviewText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  passageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  passageInfo: {
    flex: 1,
  },
  passageTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  passageReference: {
    fontSize: 14,
    color: Colors.subtitle,
    marginTop: 2,
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
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  sourceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sourceName: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text,
  },
  sourceStats: {
    fontSize: 14,
    color: Colors.subtitle,
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    color: Colors.separator,
  },
});
