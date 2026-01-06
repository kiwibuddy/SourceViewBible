/**
 * Sources List Screen
 * 
 * List of all sources (speakers) with filtering options.
 * Ported from legacy/App/js/Scenes/Sources/Sources.js
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, formatNumber } from '../../src/common';
import { SourceIcon } from '../../src/components';

// Mock data - will be replaced with real Realm data
const MOCK_SOURCES = [
  { id: 1, name: 'God', wordCount: 35000, principalSourceType: 'god', isDivine: true, sphereWordCount: 18000, bookCount: 55 },
  { id: 2, name: 'Jesus', wordCount: 32000, principalSourceType: 'god', isDivine: true, sphereWordCount: 16500, bookCount: 4 },
  { id: 3, name: 'Moses', wordCount: 18000, principalSourceType: 'lead', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 9500, bookCount: 5 },
  { id: 4, name: 'David', wordCount: 15000, principalSourceType: 'lead', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 7200, bookCount: 6 },
  { id: 5, name: 'Paul', wordCount: 25000, principalSourceType: 'support', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 12000, bookCount: 13 },
  { id: 6, name: 'Peter', wordCount: 12000, principalSourceType: 'support', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 5800, bookCount: 3 },
  { id: 7, name: 'Abraham', wordCount: 8000, principalSourceType: 'lead', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 3800, bookCount: 2 },
  { id: 8, name: 'Isaiah', wordCount: 6500, principalSourceType: 'support', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 3200, bookCount: 1 },
  { id: 9, name: 'Solomon', wordCount: 5500, principalSourceType: 'lead', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 2800, bookCount: 3 },
  { id: 10, name: 'Jacob', wordCount: 4800, principalSourceType: 'lead', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 2200, bookCount: 1 },
  { id: 11, name: 'Joseph', wordCount: 4500, principalSourceType: 'lead', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 2100, bookCount: 1 },
  { id: 12, name: 'John', wordCount: 10000, principalSourceType: 'support', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 4500, bookCount: 5 },
  { id: 13, name: 'Elijah', wordCount: 3500, principalSourceType: 'lead', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 1800, bookCount: 2 },
  { id: 14, name: 'Samuel', wordCount: 3200, principalSourceType: 'lead', isHuman: true, isIndividual: true, hasGender: true, isFemale: false, sphereWordCount: 1600, bookCount: 2 },
  { id: 15, name: 'Mary', wordCount: 900, principalSourceType: 'support', isHuman: true, isIndividual: true, hasGender: true, isFemale: true, sphereWordCount: 450, bookCount: 2 },
  { id: 16, name: 'Satan', wordCount: 1200, principalSourceType: 'support', isDemonic: true, sphereWordCount: 600, bookCount: 3 },
  { id: 17, name: 'Gabriel', wordCount: 800, principalSourceType: 'support', isAngelic: true, sphereWordCount: 400, bookCount: 2 },
];

type FilterType = 'all' | 'divine' | 'human' | 'angelic' | 'demonic';

interface SourceItemProps {
  source: typeof MOCK_SOURCES[0];
  onPress: () => void;
}

function SourceItem({ source, onPress }: SourceItemProps) {
  return (
    <TouchableOpacity style={styles.sourceItem} onPress={onPress} activeOpacity={0.7}>
      <SourceIcon
        source={source}
        principalSourceType={source.principalSourceType}
        size={44}
      />
      <View style={styles.sourceInfo}>
        <Text style={styles.sourceName}>{source.name}</Text>
        <Text style={styles.sourceStats}>
          {formatNumber(source.wordCount)} words • {source.bookCount} books
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function SourcesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredSources = useMemo(() => {
    let sources = [...MOCK_SOURCES];

    // Apply search filter
    if (searchQuery) {
      sources = sources.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filter !== 'all') {
      sources = sources.filter(s => {
        if (filter === 'divine') return s.isDivine;
        if (filter === 'human') return s.isHuman;
        if (filter === 'angelic') return s.isAngelic;
        if (filter === 'demonic') return s.isDemonic;
        return true;
      });
    }

    // Sort by word count
    return sources.sort((a, b) => b.wordCount - a.wordCount);
  }, [searchQuery, filter]);

  const renderSource = ({ item }: { item: typeof MOCK_SOURCES[0] }) => (
    <SourceItem
      source={item}
      onPress={() => router.push(`/sources/${item.id}`)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search sources..."
          placeholderTextColor={Colors.subtitle}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'divine', 'human', 'angelic', 'demonic'] as FilterType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterTab, filter === type && styles.filterTabActive]}
            onPress={() => setFilter(type)}
          >
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredSources.length} source{filteredSources.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={filteredSources}
        renderItem={renderSource}
        keyExtractor={(item) => item.id.toString()}
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
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.separator,
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
    fontSize: 13,
    color: Colors.subtitle,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  resultsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  resultsText: {
    fontSize: 13,
    color: Colors.subtitle,
  },
  listContent: {
    paddingBottom: 20,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
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
    fontSize: 13,
    color: Colors.subtitle,
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    color: Colors.separator,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginLeft: 71,
  },
});
