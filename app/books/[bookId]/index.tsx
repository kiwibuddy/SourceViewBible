/**
 * Book Overview Screen
 * 
 * Shows book statistics, word cloud, top sources, and overview text.
 * Ported from legacy/App/js/Scenes/Books/BookOverview.js
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
// LinearGradient removed - requires native rebuild
import { Colors, readingTime, formatNumber } from '../../../src/common';
import { Icon, SourceIcon, WordCloud, SourcesBarChart, SpheresBarChart } from '../../../src/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data - will be replaced with real Realm data
const MOCK_BOOK_DATA: Record<string, any> = {
  genesis: {
    id: 'genesis',
    name: 'Genesis',
    wordCount: 38262,
    chapterCount: 50,
    sourceCount: 42,
    sphereWordCount: 18500,
    principalSourceType: 'narrator',
    overview: [
      {
        title: 'Overview',
        body: 'Genesis, the first book of the Bible, reveals the beginnings of everything. It records the creation of the universe, the origin of humanity, the fall into sin, and the starting points of God\'s plan of redemption. The book follows the lives of the patriarchs—Abraham, Isaac, Jacob, and Joseph—showing how God worked through them to establish a people for himself.',
      },
    ],
    topSources: [
      { id: 1, name: 'God', wordCount: 8500, principalSourceType: 'god' },
      { id: 2, name: 'Jacob', wordCount: 3200, principalSourceType: 'lead' },
      { id: 3, name: 'Joseph', wordCount: 2800, principalSourceType: 'lead' },
      { id: 4, name: 'Abraham', wordCount: 2400, principalSourceType: 'lead' },
    ],
    words: ['God', 'said', 'Lord', 'land', 'son', 'father', 'Israel', 'sons', 'Jacob', 'Joseph'],
  },
  matthew: {
    id: 'matthew',
    name: 'Matthew',
    wordCount: 23684,
    chapterCount: 28,
    sourceCount: 28,
    sphereWordCount: 12400,
    principalSourceType: 'lead',
    overview: [
      {
        title: 'Overview',
        body: 'Matthew presents Jesus as the long-awaited Messiah and King of the Jews. Written primarily for a Jewish audience, it emphasizes Jesus\' fulfillment of Old Testament prophecies and his teachings about the Kingdom of Heaven. The Gospel includes the Sermon on the Mount and ends with the Great Commission.',
      },
    ],
    topSources: [
      { id: 1, name: 'Jesus', wordCount: 13000, principalSourceType: 'god' },
      { id: 2, name: 'Peter', wordCount: 800, principalSourceType: 'lead' },
      { id: 3, name: 'Pharisees', wordCount: 500, principalSourceType: 'support' },
    ],
    words: ['Jesus', 'kingdom', 'heaven', 'Father', 'disciples', 'said', 'told', 'people', 'Son', 'God'],
  },
};

// Default mock data for any book
const DEFAULT_BOOK_DATA = {
  id: 'unknown',
  name: 'Book',
  wordCount: 10000,
  chapterCount: 10,
  sourceCount: 15,
  sphereWordCount: 5000,
  principalSourceType: 'narrator',
  overview: [{ title: 'Overview', body: 'Book overview content will be loaded from the database.' }],
  topSources: [],
  words: ['word', 'content', 'text'],
};

export default function BookOverviewScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();

  // Get book data (mock for now)
  const book = MOCK_BOOK_DATA[bookId || ''] || { ...DEFAULT_BOOK_DATA, name: bookId || 'Book' };
  const spherePercent = Math.round((book.sphereWordCount / book.wordCount) * 100);
  const sourceColors = Colors.sources[book.principalSourceType as keyof typeof Colors.sources] || Colors.sources.narrator;

  return (
    <ScrollView style={styles.container}>
      {/* Word Cloud Header */}
      <WordCloud
        backgroundColors={sourceColors.gradient.big}
        style={styles.wordCloudContainer}
      >
        <View style={styles.wordCloudContent}>
          <Text style={styles.wordCloudTitle}>{book.name}</Text>
          <View style={styles.wordsContainer}>
            {book.words.slice(0, 8).map((word: string, index: number) => (
              <Text
                key={index}
                style={[
                  styles.wordCloudWord,
                  { opacity: 1 - index * 0.1, fontSize: 14 - index * 0.5 },
                ]}
              >
                {word}
              </Text>
            ))}
          </View>
        </View>
      </WordCloud>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{book.chapterCount}</Text>
          <Text style={styles.statLabel}>Chapters</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{book.sourceCount}</Text>
          <Text style={styles.statLabel}>Sources</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{spherePercent}%</Text>
          <Text style={styles.statLabel}>Spheres</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{readingTime(book.wordCount)}</Text>
          <Text style={styles.statLabel}>Read Time</Text>
        </View>
      </View>

      {/* Start Reading Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push(`/reader/${bookId}?chapter=1`)}
      >
        <View style={[styles.startButtonGradient, { backgroundColor: sourceColors.tint }]}>
          <Text style={styles.startButtonText}>Start Reading</Text>
        </View>
      </TouchableOpacity>

      {/* Top Sources */}
      {book.topSources.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOP SOURCES</Text>
          {book.topSources.map((source: any) => (
            <TouchableOpacity
              key={source.id}
              style={styles.sourceItem}
              onPress={() => router.push(`/sources/${source.id}`)}
            >
              <SourceIcon
                source={source}
                principalSourceType={source.principalSourceType}
                size={36}
              />
              <View style={styles.sourceInfo}>
                <Text style={styles.sourceName}>{source.name}</Text>
                <Text style={styles.sourceStats}>
                  {formatNumber(source.wordCount)} words
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Overview */}
      {book.overview.map((content: any, index: number) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{content.title?.toUpperCase() || 'OVERVIEW'}</Text>
          <Text style={styles.overviewText}>{content.body}</Text>
        </View>
      ))}

      {/* Navigation Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => router.push(`/books/${bookId}/chapters`)}
        >
          <Text style={styles.linkText}>Chapters</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => router.push(`/books/${bookId}/sources`)}
        >
          <Text style={styles.linkText}>Sources</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => router.push(`/books/${bookId}/spheres`)}
        >
          <Text style={styles.linkText}>Spheres</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => router.push(`/books/${bookId}/words`)}
        >
          <Text style={styles.linkText}>Words</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  wordCloudContainer: {
    height: 180,
  },
  wordCloudContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  wordCloudTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  wordCloudWord: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 6,
    marginVertical: 2,
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
  startButton: {
    marginHorizontal: 15,
    marginVertical: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  startButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
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
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sourceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sourceName: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text,
  },
  sourceStats: {
    fontSize: 13,
    color: Colors.subtitle,
    marginTop: 2,
  },
  overviewText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  linksContainer: {
    paddingBottom: 30,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  linkText: {
    fontSize: 17,
    color: Colors.text,
  },
  linkArrow: {
    fontSize: 22,
    color: Colors.separator,
  },
});
