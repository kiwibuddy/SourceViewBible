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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, readingTime } from '../../src/common';
import { BarChart } from '../../src/components';
import { useBooks } from '../../src/database/provider';
import { Book } from '../../src/data';

// Calculate max word count for scaling bar charts
const MAX_WORD_COUNT = 45000; // Psalms is the longest

interface BookItemProps {
  book: Book;
  onPress: () => void;
}

function BookItem({ book, onPress }: BookItemProps) {
  const sourceTypeColors = Colors.sources;
  
  // Create approximate source type distribution based on principal source type
  const wordCount = book.wordCount || 0;
  let sourceTypeCounts = { narrator: 0, god: 0, lead: 0, support: 0 };
  
  switch (book.principalSourceType) {
    case 'narrator':
      sourceTypeCounts = {
        narrator: wordCount * 0.65,
        god: wordCount * 0.15,
        lead: wordCount * 0.12,
        support: wordCount * 0.08,
      };
      break;
    case 'god':
      sourceTypeCounts = {
        narrator: wordCount * 0.25,
        god: wordCount * 0.55,
        lead: wordCount * 0.12,
        support: wordCount * 0.08,
      };
      break;
    case 'lead':
      sourceTypeCounts = {
        narrator: wordCount * 0.30,
        god: wordCount * 0.10,
        lead: wordCount * 0.48,
        support: wordCount * 0.12,
      };
      break;
    default:
      sourceTypeCounts = {
        narrator: wordCount * 0.45,
        god: wordCount * 0.15,
        lead: wordCount * 0.20,
        support: wordCount * 0.20,
      };
  }
  
  const bars = [
    { color: sourceTypeColors.narrator.tint, value: sourceTypeCounts.narrator },
    { color: sourceTypeColors.god.tint, value: sourceTypeCounts.god },
    { color: sourceTypeColors.lead.tint, value: sourceTypeCounts.lead },
    { color: sourceTypeColors.support.tint, value: sourceTypeCounts.support },
  ];

  return (
    <TouchableOpacity style={styles.bookItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookName}>{book.name}</Text>
        <Text style={styles.bookStats}>
          {book.sourceCount || 0} sources • {readingTime(book.wordCount || 0)}
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
  const { books, isLoading } = useBooks();
  const [selectedTestament, setSelectedTestament] = useState<'all' | 'ot' | 'nt'>('all');

  const filteredBooks = useMemo(() => {
    if (selectedTestament === 'all') return books;
    if (selectedTestament === 'ot') return books.filter(b => b.testament === 0);
    return books.filter(b => b.testament === 1);
  }, [books, selectedTestament]);

  const renderBook = ({ item }: { item: Book }) => (
    <BookItem
      book={item}
      onPress={() => router.push(`/books/${item.id}`)}
    />
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.tint} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, selectedTestament === 'all' && styles.filterTabActive]}
          onPress={() => setSelectedTestament('all')}
        >
          <Text style={[styles.filterText, selectedTestament === 'all' && styles.filterTextActive]}>
            All ({books.length})
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
