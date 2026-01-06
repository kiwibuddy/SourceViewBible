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
  ActivityIndicator,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import Constants from 'expo-constants';
import { Colors, formatNumber, readingTime } from '../../src/common';
import { Icon, SourceIcon } from '../../src/components';
import { useBooks, useSources, useSpheres } from '../../src/database/provider';
import { Book, Actant, Sphere } from '../../src/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - 16) / 3;
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
function BookCard({ book, onPress }: { book: Book; onPress: () => void }) {
  const wordCount = book.wordCount || 0;
  const sphereWordCount = Math.floor(wordCount * 0.65); // Estimate
  const spherePercent = wordCount > 0 ? Math.round((sphereWordCount / wordCount) * 100) : 0;
  const tintColor = Colors.sources[book.principalSourceType as keyof typeof Colors.sources]?.tint || Colors.tint;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={[styles.cardGradient, { backgroundColor: tintColor }]} />
        <Icon
          name="books-filled"
          size={40}
          color={tintColor}
          style={styles.cardIcon}
        />
        <Text numberOfLines={1} style={styles.cardTitle}>{book.name}</Text>
        <Text style={styles.cardSubtitle}>{readingTime(wordCount)}</Text>
        <View style={styles.cardKeyline} />
        <View style={styles.cardStats}>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{book.sourceCount || 0}</Text>
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
function SourceCard({ source, onPress }: { source: Actant; onPress: () => void }) {
  const wordCount = source.wordCount || 0;
  const sphereWordCount = source.sphereWordCount || Math.floor(wordCount * 0.65);
  const spherePercent = wordCount > 0 ? Math.round((sphereWordCount / wordCount) * 100) : 0;
  const tintColor = Colors.sources[source.principalSourceType as keyof typeof Colors.sources]?.tint || Colors.tint;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={[styles.cardGradient, { backgroundColor: tintColor }]} />
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
            <Text style={styles.statValue}>{formatNumber(wordCount)}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Sphere card component
function SphereCard({ sphere, onPress }: { sphere: Sphere; onPress: () => void }) {
  const wordCount = sphere.wordCount || 0;
  const spherePercent = Math.round((wordCount / TOTAL_BIBLE_WORD_COUNT) * 100);
  const sphereColors = Colors.spheres[sphere.id as keyof typeof Colors.spheres] || Colors.spheres.foundational;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={[styles.cardGradient, { backgroundColor: sphereColors.tint }]} />
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
            <Text style={styles.statValue}>{sphere.sourceCount || 0}</Text>
            <Text style={styles.statLabel}>Sources</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{formatNumber(wordCount)}</Text>
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
  const { books, isLoading: booksLoading } = useBooks();
  const { sources, getTopSources, isLoading: sourcesLoading } = useSources();
  const { spheres, isLoading: spheresLoading } = useSpheres();

  // Get random selection of books (9 books for 3 pages of 3)
  const displayBooks = useMemo(() => {
    if (books.length === 0) return [];
    // Select a mix of OT and NT books
    const shuffled = [...books].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 9);
  }, [books]);

  // Get top sources by word count
  const displaySources = useMemo(() => {
    return getTopSources(9);
  }, [getTopSources]);

  // Get all non-foundational spheres
  const displaySpheres = useMemo(() => {
    return spheres.filter(s => s.id !== 'foundational');
  }, [spheres]);

  const isLoading = booksLoading || sourcesLoading || spheresLoading;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.tint} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Books Section */}
      <SectionHeader title="BOOKS" linkHref="/(tabs)/books" />
      <Carousel
        data={displayBooks}
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
        data={displaySources}
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
        data={displaySpheres}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: Colors.subtitle,
    fontSize: 14,
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
