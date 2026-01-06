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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, formatNumber } from '../../src/common';
import { SourceIcon } from '../../src/components';
import { useSources } from '../../src/database/provider';
import { Actant, getActantIconName } from '../../src/data';

type FilterType = 'all' | 'divine' | 'human' | 'angelic' | 'demonic';

interface SourceItemProps {
  source: Actant;
  onPress: () => void;
}

function SourceItem({ source, onPress }: SourceItemProps) {
  const isDivine = source.natures.some(n => n.id === 3);
  const isHuman = source.natures.some(n => n.id === 4);
  const isAngelic = source.natures.some(n => n.id === 1);
  const isDemonic = source.natures.some(n => n.id === 2);
  const isIndividual = source.actantNumber === 2;
  const hasGender = source.gender === 1 || source.gender === 2;
  const isFemale = source.gender === 1;

  // Get icon properties
  const iconProps = {
    isDivine,
    isHuman,
    isAngelic,
    isDemonic,
    isIndividual,
    hasGender,
    isFemale,
    principalSourceType: source.principalSourceType || 'support',
  };

  // Count books from chronologies
  const bookCount = source.chronologies?.length || 0;

  return (
    <TouchableOpacity style={styles.sourceItem} onPress={onPress} activeOpacity={0.7}>
      <SourceIcon
        source={iconProps}
        principalSourceType={source.principalSourceType || 'support'}
        size={44}
      />
      <View style={styles.sourceInfo}>
        <Text style={styles.sourceName}>{source.name}</Text>
        <Text style={styles.sourceStats}>
          {formatNumber(source.wordCount || 0)} words
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function SourcesScreen() {
  const router = useRouter();
  const { sources, isLoading } = useSources();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredSources = useMemo(() => {
    let results = [...sources];

    // Apply search filter
    if (searchQuery) {
      results = results.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filter !== 'all') {
      results = results.filter(s => {
        const isDivine = s.natures.some(n => n.id === 3);
        const isHuman = s.natures.some(n => n.id === 4);
        const isAngelic = s.natures.some(n => n.id === 1);
        const isDemonic = s.natures.some(n => n.id === 2);
        
        if (filter === 'divine') return isDivine;
        if (filter === 'human') return isHuman;
        if (filter === 'angelic') return isAngelic;
        if (filter === 'demonic') return isDemonic;
        return true;
      });
    }

    // Sort by word count (if available) or name
    return results.sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0));
  }, [sources, searchQuery, filter]);

  const renderSource = ({ item }: { item: Actant }) => (
    <SourceItem
      source={item}
      onPress={() => router.push(`/sources/${item.id}`)}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
