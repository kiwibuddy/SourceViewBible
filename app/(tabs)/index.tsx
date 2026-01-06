/**
 * Discover Screen
 * 
 * Main home screen with carousels for Books, Sources, and Spheres.
 * Ported from legacy/App/js/Scenes/Discover/Discover.js
 */

import React, { useMemo, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Link } from 'expo-router';
import Constants from 'expo-constants';
import { Colors, formatNumber, readingTime } from '../../src/common';
import { Icon, SourceIcon } from '../../src/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - 16) / 3;

// Mock data for development (will be replaced with real data from Realm)
const MOCK_BOOKS = [
  { id: 'genesis', name: 'Genesis', wordCount: 38262, sourceCount: 42, principalSourceType: 'narrator', sphereWordCount: 18500 },
  { id: 'exodus', name: 'Exodus', wordCount: 32500, sourceCount: 35, principalSourceType: 'god', sphereWordCount: 15600 },
  { id: 'matthew', name: 'Matthew', wordCount: 23684, sourceCount: 28, principalSourceType: 'lead', sphereWordCount: 12400 },
  { id: 'john', name: 'John', wordCount: 19094, sourceCount: 22, principalSourceType: 'support', sphereWordCount: 9500 },
  { id: 'psalms', name: 'Psalms', wordCount: 42654, sourceCount: 15, principalSourceType: 'narrator', sphereWordCount: 22000 },
  { id: 'proverbs', name: 'Proverbs', wordCount: 15038, sourceCount: 8, principalSourceType: 'lead', sphereWordCount: 7800 },
  { id: 'romans', name: 'Romans', wordCount: 9447, sourceCount: 6, principalSourceType: 'support', sphereWordCount: 4200 },
  { id: 'acts', name: 'Acts', wordCount: 24250, sourceCount: 45, principalSourceType: 'narrator', sphereWordCount: 11000 },
  { id: 'revelation', name: 'Revelation', wordCount: 12000, sourceCount: 18, principalSourceType: 'god', sphereWordCount: 6800 },
];

const MOCK_SOURCES = [
  { id: 1, name: 'Jesus', wordCount: 35000, principalSourceType: 'god', sphereWordCount: 18000, isDivine: true },
  { id: 2, name: 'Paul', wordCount: 25000, principalSourceType: 'lead', sphereWordCount: 12000, isHuman: true, isIndividual: true, hasGender: true, isFemale: false },
  { id: 3, name: 'Moses', wordCount: 18000, principalSourceType: 'lead', sphereWordCount: 9500, isHuman: true, isIndividual: true, hasGender: true, isFemale: false },
  { id: 4, name: 'David', wordCount: 15000, principalSourceType: 'lead', sphereWordCount: 7200, isHuman: true, isIndividual: true, hasGender: true, isFemale: false },
  { id: 5, name: 'Peter', wordCount: 12000, principalSourceType: 'support', sphereWordCount: 5800, isHuman: true, isIndividual: true, hasGender: true, isFemale: false },
  { id: 6, name: 'John', wordCount: 10000, principalSourceType: 'support', sphereWordCount: 4500, isHuman: true, isIndividual: true, hasGender: true, isFemale: false },
  { id: 7, name: 'Abraham', wordCount: 8000, principalSourceType: 'lead', sphereWordCount: 3800, isHuman: true, isIndividual: true, hasGender: true, isFemale: false },
  { id: 8, name: 'Isaiah', wordCount: 6500, principalSourceType: 'support', sphereWordCount: 3200, isHuman: true, isIndividual: true, hasGender: true, isFemale: false },
  { id: 9, name: 'Solomon', wordCount: 5500, principalSourceType: 'lead', sphereWordCount: 2800, isHuman: true, isIndividual: true, hasGender: true, isFemale: false },
];

const MOCK_SPHERES = [
  { id: 'family', name: 'Family', wordCount: 45000, sourceCount: 85 },
  { id: 'economics', name: 'Economics', wordCount: 38000, sourceCount: 72 },
  { id: 'government', name: 'Government', wordCount: 52000, sourceCount: 95 },
  { id: 'religion', name: 'Religion', wordCount: 78000, sourceCount: 120 },
  { id: 'education', name: 'Education', wordCount: 28000, sourceCount: 55 },
  { id: 'communication', name: 'Communication', wordCount: 32000, sourceCount: 65 },
  { id: 'celebration', name: 'Celebration', wordCount: 18000, sourceCount: 42 },
  { id: 'foundational', name: 'Foundational', wordCount: 85000, sourceCount: 150 },
];

const TOTAL_BIBLE_WORD_COUNT = 783137; // NLT word count

// Page indicator component
function PageIndicator({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.pageIndicator}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.pageIndicatorDot,
            i === current && styles.pageIndicatorDotActive,
          ]}
        />
      ))}
    </View>
  );
}

// Book card component
function BookCard({ book, onPress }: { book: typeof MOCK_BOOKS[0]; onPress: () => void }) {
  const spherePercent = Math.round((book.sphereWordCount / book.wordCount) * 100);
  const gradientColors = Colors.sources[book.principalSourceType as keyof typeof Colors.sources]?.gradient.tiny || Colors.sources.other.gradient.tiny;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0.25 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.cardGradient}
        />
        <Icon
          name="books-filled"
          size={40}
          color={Colors.sources[book.principalSourceType as keyof typeof Colors.sources]?.tint || Colors.tint}
          style={styles.cardIcon}
        />
        <Text numberOfLines={1} style={styles.cardTitle}>{book.name}</Text>
        <Text style={styles.cardSubtitle}>{readingTime(book.wordCount)}</Text>
        <View style={styles.cardKeyline} />
        <View style={styles.cardStats}>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{book.sourceCount}</Text>
            <Text style={styles.statLabel}>Sources</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{spherePercent}%</Text>
            <Text style={styles.statLabel}>Spheres</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Source card component
function SourceCard({ source, onPress }: { source: typeof MOCK_SOURCES[0]; onPress: () => void }) {
  const spherePercent = Math.round((source.sphereWordCount / source.wordCount) * 100);
  const gradientColors = Colors.sources[source.principalSourceType as keyof typeof Colors.sources]?.gradient.tiny || Colors.sources.other.gradient.tiny;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0.25 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.cardGradient}
        />
        <View style={styles.cardIconContainer}>
          <SourceIcon
            source={source}
            principalSourceType={source.principalSourceType}
            size={40}
          />
        </View>
        <View style={styles.sourceNameContainer}>
          <Text numberOfLines={2} style={styles.cardTitle}>{source.name}</Text>
        </View>
        <View style={styles.cardKeyline} />
        <View style={styles.cardStats}>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{spherePercent}%</Text>
            <Text style={styles.statLabel}>Spheres</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{formatNumber(source.wordCount)}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Sphere card component
function SphereCard({ sphere, onPress }: { sphere: typeof MOCK_SPHERES[0]; onPress: () => void }) {
  const spherePercent = Math.round((sphere.wordCount / TOTAL_BIBLE_WORD_COUNT) * 100);
  const sphereColors = Colors.spheres[sphere.id as keyof typeof Colors.spheres] || Colors.spheres.foundational;
  const gradientColors = sphereColors.gradient.tiny;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0.25 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.cardGradient}
        />
        <Icon
          name={`${sphere.id}-filled`}
          size={40}
          color={sphereColors.tint}
          style={styles.cardIcon}
        />
        <Text style={styles.cardTitle}>{sphere.name}</Text>
        <Text style={styles.cardSubtitle}>{spherePercent}%</Text>
        <View style={styles.cardKeyline} />
        <View style={styles.cardStats}>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{sphere.sourceCount}</Text>
            <Text style={styles.statLabel}>Sources</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{formatNumber(sphere.wordCount)}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Section header component
function SectionHeader({ title, linkHref, linkLabel = 'View All' }: { title: string; linkHref: string; linkLabel?: string }) {
  return (
    <Link href={linkHref as any} asChild>
      <TouchableOpacity style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionLink}>
          <Text style={styles.sectionLinkText}>{linkLabel}</Text>
          <Text style={styles.sectionLinkArrow}>›</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

// Carousel component
function Carousel<T>({
  data,
  renderItem,
  keyExtractor,
}: {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    const page = Math.round(offset / (SCREEN_WIDTH - 8));
    setCurrentPage(page);
  }, []);

  const totalPages = Math.ceil(data.length / 3);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={SCREEN_WIDTH - 8}
        decelerationRate="fast"
        style={styles.carousel}
        contentContainerStyle={styles.carouselContent}
      />
      <PageIndicator total={totalPages} current={currentPage} />
    </View>
  );
}

export default function DiscoverScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Books Section */}
      <SectionHeader title="BOOKS" linkHref="/(tabs)/books" />
      <Carousel
        data={MOCK_BOOKS}
        keyExtractor={(book) => book.id}
        renderItem={(book) => (
          <BookCard
            book={book}
            onPress={() => router.push(`/books/${book.id}`)}
          />
        )}
      />

      <View style={styles.separator} />

      {/* Sources Section */}
      <SectionHeader title="SOURCES" linkHref="/(tabs)/sources" />
      <Carousel
        data={MOCK_SOURCES}
        keyExtractor={(source) => source.id.toString()}
        renderItem={(source) => (
          <SourceCard
            source={source}
            onPress={() => router.push(`/sources/${source.id}`)}
          />
        )}
      />

      <View style={styles.separator} />

      {/* Spheres Section */}
      <SectionHeader title="SPHERES" linkHref="/(tabs)/spheres" />
      <Carousel
        data={MOCK_SPHERES.filter(s => s.id !== 'foundational')}
        keyExtractor={(sphere) => sphere.id}
        renderItem={(sphere) => (
          <SphereCard
            sphere={sphere}
            onPress={() => router.push(`/spheres/${sphere.id}`)}
          />
        )}
      />

      <View style={styles.separator} />

      {/* About Footer */}
      <Link href="/about" asChild>
        <TouchableOpacity style={styles.aboutContainer}>
          <Text style={styles.copyright}>SourceView Publishing, LLC ©2016</Text>
          <Text style={styles.copyright}>
            Version {Constants.expoConfig?.version || '2.0.0'}
          </Text>
          <Text style={styles.learnMore}>Learn More</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.subtitle,
    letterSpacing: 1,
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLinkText: {
    fontSize: 13,
    color: Colors.tint,
  },
  sectionLinkArrow: {
    fontSize: 18,
    color: Colors.tint,
    marginLeft: 4,
  },
  carousel: {
    marginHorizontal: 4,
  },
  carouselContent: {
    paddingVertical: 5,
  },
  cardContainer: {
    width: ITEM_WIDTH,
  },
  card: {
    marginHorizontal: 4,
    marginBottom: 8,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    height: 138,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: { height: 1, width: 0 },
  },
  cardGradient: {
    height: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  cardIcon: {
    alignSelf: 'center',
    marginTop: 7,
  },
  cardIconContainer: {
    alignSelf: 'center',
    marginTop: 7,
  },
  cardTitle: {
    fontSize: 13,
    color: '#59626a',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 1,
    paddingHorizontal: 5,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#9b9b9b',
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 7,
  },
  sourceNameContainer: {
    height: 40,
    justifyContent: 'center',
  },
  cardKeyline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 2,
  },
  cardStats: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 5,
    marginTop: 7,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statValue: {
    fontSize: 11,
    color: Colors.tint,
    marginRight: 3,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.subtitle,
    flex: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginLeft: 8,
    marginVertical: 8,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  pageIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  pageIndicatorDotActive: {
    backgroundColor: Colors.tint,
  },
  aboutContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 13,
    color: '#9B9B9B',
  },
  learnMore: {
    fontSize: 13,
    color: Colors.tint,
    marginTop: 4,
  },
});
