/**
 * Books List Screen
 * 
 * Scrollable list of all 66 books with bar charts showing source type distribution.
 * Ported from legacy/App/js/Scenes/Books/Books.js
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SegmentedControlIOSComponent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, readingTime, formatNumber } from '../../src/common';
import { BarChart, Icon } from '../../src/components';

// Mock data - will be replaced with real Realm data
const MOCK_BOOKS = [
  { id: 'genesis', name: 'Genesis', testament: 1, textOrder: 1, wordCount: 38262, sourceCount: 42, principalSourceType: 'narrator', sourceTypeCounts: { narrator: 25000, god: 8000, lead: 3500, support: 1762 }, maxSourceWordCount: 25000 },
  { id: 'exodus', name: 'Exodus', testament: 1, textOrder: 2, wordCount: 32500, sourceCount: 35, principalSourceType: 'god', sourceTypeCounts: { narrator: 12000, god: 15000, lead: 3500, support: 2000 }, maxSourceWordCount: 15000 },
  { id: 'leviticus', name: 'Leviticus', testament: 1, textOrder: 3, wordCount: 24500, sourceCount: 8, principalSourceType: 'god', sourceTypeCounts: { narrator: 5000, god: 18000, lead: 1000, support: 500 }, maxSourceWordCount: 18000 },
  { id: 'numbers', name: 'Numbers', testament: 1, textOrder: 4, wordCount: 32600, sourceCount: 42, principalSourceType: 'narrator', sourceTypeCounts: { narrator: 20000, god: 8000, lead: 3000, support: 1600 }, maxSourceWordCount: 20000 },
  { id: 'deuteronomy', name: 'Deuteronomy', testament: 1, textOrder: 5, wordCount: 28450, sourceCount: 12, principalSourceType: 'lead', sourceTypeCounts: { narrator: 5000, god: 3000, lead: 19000, support: 1450 }, maxSourceWordCount: 19000 },
  { id: 'joshua', name: 'Joshua', testament: 1, textOrder: 6, wordCount: 18858, sourceCount: 25, principalSourceType: 'narrator', sourceTypeCounts: { narrator: 12000, god: 2500, lead: 3000, support: 1358 }, maxSourceWordCount: 12000 },
  { id: 'judges', name: 'Judges', testament: 1, textOrder: 7, wordCount: 18976, sourceCount: 45, principalSourceType: 'narrator', sourceTypeCounts: { narrator: 13000, god: 1500, lead: 2800, support: 1676 }, maxSourceWordCount: 13000 },
  { id: 'ruth', name: 'Ruth', testament: 1, textOrder: 8, wordCount: 2578, sourceCount: 6, principalSourceType: 'narrator', sourceTypeCounts: { narrator: 1500, god: 200, lead: 600, support: 278 }, maxSourceWordCount: 1500 },
  { id: '1-samuel', name: '1 Samuel', testament: 1, textOrder: 9, wordCount: 25068, sourceCount: 55, principalSourceType: 'narrator', sourceTypeCounts: { narrator: 16000, god: 2500, lead: 4500, support: 2068 }, maxSourceWordCount: 16000 },
  { id: '2-samuel', name: '2 Samuel', testament: 1, textOrder: 10, wordCount: 20612, sourceCount: 48, principalSourceType: 'narrator', sourceTypeCounts: { narrator: 14000, god: 1500, lead: 3500, support: 1612 }, maxSourceWordCount: 14000 },
  // ... more books would be added here from the database
  { id: 'matthew', name: 'Matthew', testament: 2, textOrder: 40, wordCount: 23684, sourceCount: 28, principalSourceType: 'lead', sourceTypeCounts: { narrator: 8000, god: 500, lead: 13000, support: 2184 }, maxSourceWordCount: 13000 },
  { id: 'mark', name: 'Mark', testament: 2, textOrder: 41, wordCount: 15171, sourceCount: 22, principalSourceType: 'lead', sourceTypeCounts: { narrator: 6000, god: 300, lead: 7500, support: 1371 }, maxSourceWordCount: 7500 },
  { id: 'luke', name: 'Luke', testament: 2, textOrder: 42, wordCount: 25944, sourceCount: 38, principalSourceType: 'narrator', sourceTypeCounts: { narrator: 14000, god: 500, lead: 9500, support: 1944 }, maxSourceWordCount: 14000 },
  { id: 'john', name: 'John', testament: 2, textOrder: 43, wordCount: 19094, sourceCount: 22, principalSourceType: 'lead', sourceTypeCounts: { narrator: 5500, god: 500, lead: 11000, support: 2094 }, maxSourceWordCount: 11000 },
  { id: 'acts', name: 'Acts', testament: 2, textOrder: 44, wordCount: 24250, sourceCount: 45, principalSourceType: 'narrator', sourceTypeCounts: { narrator: 16000, god: 500, lead: 5500, support: 2250 }, maxSourceWordCount: 16000 },
  { id: 'romans', name: 'Romans', testament: 2, textOrder: 45, wordCount: 9447, sourceCount: 6, principalSourceType: 'support', sourceTypeCounts: { narrator: 1000, god: 500, lead: 1500, support: 6447 }, maxSourceWordCount: 6447 },
  { id: 'revelation', name: 'Revelation', testament: 2, textOrder: 66, wordCount: 12000, sourceCount: 18, principalSourceType: 'god', sourceTypeCounts: { narrator: 3000, god: 6000, lead: 2000, support: 1000 }, maxSourceWordCount: 6000 },
];

// Calculate max word count for scaling bar charts
const MAX_WORD_COUNT = Math.max(...MOCK_BOOKS.map(b => b.wordCount));

interface BookItemProps {
  book: typeof MOCK_BOOKS[0];
  onPress: () => void;
}

function BookItem({ book, onPress }: BookItemProps) {
  const sourceTypeColors = Colors.sources;
  const bars = [
    { color: sourceTypeColors.narrator.tint, value: book.sourceTypeCounts.narrator },
    { color: sourceTypeColors.god.tint, value: book.sourceTypeCounts.god },
    { color: sourceTypeColors.lead.tint, value: book.sourceTypeCounts.lead },
    { color: sourceTypeColors.support.tint, value: book.sourceTypeCounts.support },
  ];

  return (
    <TouchableOpacity style={styles.bookItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookName}>{book.name}</Text>
        <Text style={styles.bookStats}>
          {book.sourceCount} sources • {readingTime(book.wordCount)}
        </Text>
      </View>
      <View style={styles.chartContainer}>
        <BarChart
          bars={bars}
          maxChartValue={MAX_WORD_COUNT}
          horizontal
          style={styles.barChart}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function BooksScreen() {
  const router = useRouter();
  const [selectedTestament, setSelectedTestament] = useState<'all' | 'ot' | 'nt'>('all');

  const filteredBooks = useMemo(() => {
    if (selectedTestament === 'all') return MOCK_BOOKS;
    if (selectedTestament === 'ot') return MOCK_BOOKS.filter(b => b.testament === 1);
    return MOCK_BOOKS.filter(b => b.testament === 2);
  }, [selectedTestament]);

  const renderBook = ({ item }: { item: typeof MOCK_BOOKS[0] }) => (
    <BookItem
      book={item}
      onPress={() => router.push(`/books/${item.id}`)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, selectedTestament === 'all' && styles.filterTabActive]}
          onPress={() => setSelectedTestament('all')}
        >
          <Text style={[styles.filterText, selectedTestament === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedTestament === 'ot' && styles.filterTabActive]}
          onPress={() => setSelectedTestament('ot')}
        >
          <Text style={[styles.filterText, selectedTestament === 'ot' && styles.filterTextActive]}>
            Old Testament
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedTestament === 'nt' && styles.filterTabActive]}
          onPress={() => setSelectedTestament('nt')}
        >
          <Text style={[styles.filterText, selectedTestament === 'nt' && styles.filterTextActive]}>
            New Testament
          </Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.sources.narrator.tint }]} />
          <Text style={styles.legendText}>Narrator</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.sources.god.tint }]} />
          <Text style={styles.legendText}>God</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.sources.lead.tint }]} />
          <Text style={styles.legendText}>Lead</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.sources.support.tint }]} />
          <Text style={styles.legendText}>Support</Text>
        </View>
      </View>

      <FlatList
        data={filteredBooks}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: Colors.tint,
  },
  filterText: {
    fontSize: 14,
    color: Colors.subtitle,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    color: Colors.subtitle,
  },
  listContent: {
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  bookInfo: {
    flex: 1,
    marginRight: 15,
  },
  bookName: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text,
  },
  bookStats: {
    fontSize: 13,
    color: Colors.subtitle,
    marginTop: 2,
  },
  chartContainer: {
    width: 100,
  },
  barChart: {
    height: 24,
    borderRadius: 4,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginLeft: 15,
  },
});
