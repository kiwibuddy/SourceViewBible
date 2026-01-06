/**
 * Bible Reader Screen
 * 
 * Displays scripture text with sphere highlighting and source indicators.
 * Ported from legacy/App/js/Scenes/Reader/Reader.js
 * 
 * Features:
 * - Swipe right to reveal source names and occurrence numbers
 * - Color-coded text by source type (red=God, green=Lead, blue=Support, black=Narrator)
 * - Sphere highlighting with background colors
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors, SphereNames } from '../../src/common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SOURCE_COLUMN_WIDTH = 120; // Width of the source name column when revealed

// Source types and their colors
const SOURCE_COLORS = {
  narrator: { color: '#4A4A4A', label: 'Narrator' },
  god: { color: '#fc3d39', label: 'God' },
  lead: { color: '#19A555', label: 'Lead' },
  support: { color: '#218aff', label: 'Support' },
};

// Sphere highlight colors
const SPHERE_HIGHLIGHTS = {
  family: '#FFD8D6',
  economics: '#FFEACC',
  government: '#FFF5CD',
  religion: '#E8F4CE',
  education: '#D4F1F7',
  communication: '#DEDEF7',
  celebration: '#F9DEEF',
};

// Mock scripture content with source info - will be replaced with Emdros database queries
const MOCK_SCRIPTURE: Record<string, any> = {
  genesis: {
    1: {
      title: 'Genesis 1',
      content: [
        { type: 'verse', num: 1, text: 'In the beginning God created the heavens and the earth.', sourceType: 'narrator' },
        { type: 'verse', num: 2, text: 'The earth was formless and empty, and darkness covered the deep waters. And the Spirit of God was hovering over the surface of the waters.', sourceType: 'narrator' },
        { type: 'speech', num: 3, text: '"Let there be light,"', sourceName: 'God', sourceOccurrence: 1, sourceType: 'god' },
        { type: 'verse', num: 3, text: 'Then God said, ', prefix: true, sourceType: 'narrator' },
        { type: 'verse', text: ' and there was light.', suffix: true, sourceType: 'narrator' },
        { type: 'verse', num: 4, text: 'And God saw that the light was good. Then he separated the light from the darkness.', sourceType: 'narrator' },
        { type: 'speech', num: 5, text: '"day"', sourceName: 'God', sourceOccurrence: 2, sourceType: 'god', inline: true },
        { type: 'speech', text: '"night."', sourceName: 'God', sourceOccurrence: 2, sourceType: 'god', inline: true },
        { type: 'verse', num: 5, text: 'God called the light ', prefix: true, sourceType: 'narrator' },
        { type: 'verse', text: ' and the darkness ', sourceType: 'narrator' },
        { type: 'verse', text: ' And evening passed and morning came, marking the first day.', sourceType: 'narrator' },
        { type: 'speech', num: 6, text: '"Let there be a space between the waters, to separate the waters of the heavens from the waters of the earth."', sourceName: 'God', sourceOccurrence: 3, sourceType: 'god', sphere: 'religion' },
        { type: 'verse', num: 6, text: 'Then God said, ', prefix: true, sourceType: 'narrator' },
        { type: 'verse', num: 7, text: 'And that is what happened. God made this space to separate the waters of the earth from the waters of the heavens.', sourceType: 'narrator' },
        { type: 'speech', num: 8, text: '"sky."', sourceName: 'God', sourceOccurrence: 4, sourceType: 'god', inline: true },
        { type: 'verse', num: 8, text: 'God called the space ', prefix: true, sourceType: 'narrator' },
        { type: 'verse', text: ' And evening passed and morning came, marking the second day.', sourceType: 'narrator' },
        { type: 'speech', num: 9, text: '"Let the waters beneath the sky flow together into one place, so dry ground may appear."', sourceName: 'God', sourceOccurrence: 5, sourceType: 'god' },
        { type: 'verse', num: 9, text: 'Then God said, ', prefix: true, sourceType: 'narrator' },
        { type: 'verse', text: ' And that is what happened.', sourceType: 'narrator' },
        { type: 'speech', num: 10, text: '"land"', sourceName: 'God', sourceOccurrence: 6, sourceType: 'god', inline: true },
        { type: 'speech', text: '"seas."', sourceName: 'God', sourceOccurrence: 6, sourceType: 'god', inline: true },
        { type: 'verse', num: 10, text: 'God called the dry ground ', prefix: true, sourceType: 'narrator' },
        { type: 'verse', text: ' and the waters ', sourceType: 'narrator' },
        { type: 'verse', text: ' And God saw that it was good.', sourceType: 'narrator' },
      ],
    },
    2: {
      title: 'Genesis 2',
      content: [
        { type: 'verse', num: 1, text: 'So the creation of the heavens and the earth and everything in them was completed.', sourceType: 'narrator' },
        { type: 'verse', num: 2, text: 'On the seventh day God had finished his work of creation, so he rested from all his work.', sourceType: 'narrator', sphere: 'celebration' },
        { type: 'verse', num: 3, text: 'And God blessed the seventh day and declared it holy, because it was the day when he rested from all his work of creation.', sourceType: 'narrator', sphere: 'religion' },
        { type: 'verse', num: 4, text: 'This is the account of the creation of the heavens and the earth.', sourceType: 'narrator' },
        { type: 'verse', num: 5, text: 'When the LORD God made the earth and the heavens, neither wild plants nor grains were growing on the earth.', sourceType: 'narrator' },
        { type: 'verse', num: 6, text: 'For the LORD God had not yet sent rain to water the earth, and there were no people to cultivate the soil.', sourceType: 'narrator' },
        { type: 'verse', num: 7, text: 'Then the LORD God formed the man from the dust of the ground. He breathed the breath of life into the man\'s nostrils, and the man became a living person.', sourceType: 'narrator' },
        { type: 'speech', num: 16, text: '"You may freely eat the fruit of every tree in the garden—except the tree of the knowledge of good and evil. If you eat its fruit, you are sure to die."', sourceName: 'God', sourceOccurrence: 12, sourceType: 'god', sphere: 'religion' },
        { type: 'verse', num: 16, text: 'But the LORD God warned him, ', prefix: true, sourceType: 'narrator' },
        { type: 'speech', num: 18, text: '"It is not good for the man to be alone. I will make a helper who is just right for him."', sourceName: 'God', sourceOccurrence: 13, sourceType: 'god', sphere: 'family' },
        { type: 'verse', num: 18, text: 'Then the LORD God said, ', prefix: true, sourceType: 'narrator' },
        { type: 'speech', num: 23, text: '"At last! This one is bone from my bone, and flesh from my flesh! She will be called \'woman,\' because she was taken from \'man.\'"', sourceName: 'Adam', sourceOccurrence: 1, sourceType: 'support', sphere: 'family' },
        { type: 'verse', num: 23, text: '"At last!" the man exclaimed. ', prefix: true, sourceType: 'narrator' },
      ],
    },
  },
  matthew: {
    1: {
      title: 'Matthew 1',
      content: [
        { type: 'verse', num: 1, text: 'This is a record of the ancestors of Jesus the Messiah, a descendant of David and of Abraham:', sourceType: 'narrator', sphere: 'family' },
        { type: 'verse', num: 2, text: 'Abraham was the father of Isaac. Isaac was the father of Jacob. Jacob was the father of Judah and his brothers.', sourceType: 'narrator', sphere: 'family' },
        { type: 'verse', num: 3, text: 'Judah was the father of Perez and Zerah (whose mother was Tamar). Perez was the father of Hezron. Hezron was the father of Ram.', sourceType: 'narrator', sphere: 'family' },
        { type: 'speech', num: 20, text: '"Joseph, son of David, do not be afraid to take Mary as your wife. For the child within her was conceived by the Holy Spirit."', sourceName: 'Angel', sourceOccurrence: 1, sourceType: 'support', sphere: 'family' },
        { type: 'verse', num: 20, text: 'As he considered this, an angel of the Lord appeared to him in a dream. ', prefix: true, sourceType: 'narrator' },
        { type: 'verse', text: ' the angel said.', suffix: true, sourceType: 'narrator' },
      ],
    },
  },
};

interface VerseRowProps {
  item: any;
  fontSize: number;
  sphereSettings: Record<string, boolean>;
  translateX: Animated.Value;
}

function VerseRow({ item, fontSize, sphereSettings, translateX }: VerseRowProps) {
  const sourceColor = SOURCE_COLORS[item.sourceType as keyof typeof SOURCE_COLORS]?.color || '#4A4A4A';
  const sphereHighlight = item.sphere && sphereSettings[item.sphere] 
    ? SPHERE_HIGHLIGHTS[item.sphere as keyof typeof SPHERE_HIGHLIGHTS] 
    : undefined;

  // Determine if this is a speech with source name
  const showSourceLabel = item.type === 'speech' && item.sourceName && !item.inline;

  return (
    <Animated.View 
      style={[
        styles.verseRow,
        { transform: [{ translateX }] }
      ]}
    >
      {/* Source Label Column (hidden by default, revealed on swipe) */}
      <View style={styles.sourceColumn}>
        {showSourceLabel && (
          <View style={styles.sourceLabelContainer}>
            <Text style={styles.sourceLabel}>
              {item.sourceName?.toUpperCase()}
            </Text>
            <Text style={styles.sourceOccurrence}>
              {item.sourceOccurrence}
            </Text>
          </View>
        )}
      </View>

      {/* Text Column */}
      <View style={[styles.textColumn, sphereHighlight && { backgroundColor: sphereHighlight }]}>
        <Text style={[styles.verseText, { fontSize, color: sourceColor }]}>
          {item.num && !item.suffix && (
            <Text style={styles.verseNum}>{item.num} </Text>
          )}
          {item.text}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();

  const [chapter, setChapter] = useState(1);
  const [fontSize, setFontSize] = useState(17);
  const [showSettings, setShowSettings] = useState(false);
  const [isSourceVisible, setIsSourceVisible] = useState(false);
  const [sphereSettings, setSphereSettings] = useState<Record<string, boolean>>({
    family: true,
    economics: true,
    government: true,
    religion: true,
    education: true,
    communication: true,
    celebration: true,
  });

  // Animation value for swipe
  const translateX = useRef(new Animated.Value(0)).current;

  // Pan responder for swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal gestures
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) + 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.max(0, Math.min(SOURCE_COLUMN_WIDTH, 
          (isSourceVisible ? SOURCE_COLUMN_WIDTH : 0) + gestureState.dx
        ));
        translateX.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldOpen = isSourceVisible 
          ? gestureState.dx > -50 
          : gestureState.dx > 50;
        
        Animated.spring(translateX, {
          toValue: shouldOpen ? SOURCE_COLUMN_WIDTH : 0,
          useNativeDriver: true,
          friction: 8,
        }).start();
        
        setIsSourceVisible(shouldOpen);
      },
    })
  ).current;

  // Get book data
  const bookData = MOCK_SCRIPTURE[bookId || 'genesis'] || MOCK_SCRIPTURE.genesis;
  const chapterData = bookData[chapter] || bookData[1];
  const maxChapter = Object.keys(bookData).length;

  const goToPreviousChapter = useCallback(() => {
    if (chapter > 1) {
      setChapter(chapter - 1);
    }
  }, [chapter]);

  const goToNextChapter = useCallback(() => {
    if (chapter < maxChapter) {
      setChapter(chapter + 1);
    }
  }, [chapter, maxChapter]);

  const toggleSphere = useCallback((sphere: string) => {
    setSphereSettings(prev => ({
      ...prev,
      [sphere]: !prev[sphere],
    }));
  }, []);

  const toggleSourceColumn = useCallback(() => {
    const newState = !isSourceVisible;
    Animated.spring(translateX, {
      toValue: newState ? SOURCE_COLUMN_WIDTH : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
    setIsSourceVisible(newState);
  }, [isSourceVisible, translateX]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: chapterData.title || `${bookId} ${chapter}`,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowSettings(!showSettings)}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>Aa</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Settings Panel */}
      {showSettings && (
        <View style={styles.settingsPanel}>
          <View style={styles.fontSizeRow}>
            <Text style={styles.settingsLabel}>Text Size</Text>
            <View style={styles.fontSizeControls}>
              <TouchableOpacity
                style={styles.fontSizeButton}
                onPress={() => setFontSize(Math.max(14, fontSize - 2))}
              >
                <Text style={styles.fontSizeButtonText}>A-</Text>
              </TouchableOpacity>
              <Text style={styles.fontSizeValue}>{fontSize}</Text>
              <TouchableOpacity
                style={styles.fontSizeButton}
                onPress={() => setFontSize(Math.min(24, fontSize + 2))}
              >
                <Text style={styles.fontSizeButtonText}>A+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.settingsLabel}>Sphere Highlighting</Text>
          <View style={styles.sphereToggles}>
            {Object.entries(SphereNames).filter(([key]) => key !== 'foundational').map(([sphere, name]) => {
              const sphereColors = Colors.spheres[sphere as keyof typeof Colors.spheres];
              const isEnabled = sphereSettings[sphere] !== false;
              return (
                <TouchableOpacity
                  key={sphere}
                  style={[
                    styles.sphereToggle,
                    isEnabled && { backgroundColor: sphereColors?.lightTint, borderColor: sphereColors?.tint },
                  ]}
                  onPress={() => toggleSphere(sphere)}
                >
                  <View style={[styles.sphereDot, { backgroundColor: sphereColors?.tint }]} />
                  <Text style={[styles.sphereToggleText, isEnabled && { color: sphereColors?.tint }]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Swipe hint */}
      <TouchableOpacity style={styles.swipeHint} onPress={toggleSourceColumn}>
        <Text style={styles.swipeHintText}>
          {isSourceVisible ? '← Swipe to hide sources' : '→ Swipe to reveal sources'}
        </Text>
      </TouchableOpacity>

      {/* Scripture Content with Swipe Gesture */}
      <View style={styles.contentContainer} {...panResponder.panHandlers}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {chapterData.content?.map((item: any, index: number) => (
            <VerseRow 
              key={index} 
              item={item} 
              fontSize={fontSize} 
              sphereSettings={sphereSettings}
              translateX={translateX}
            />
          ))}
        </ScrollView>
      </View>

      {/* Color Legend */}
      <View style={styles.legend}>
        {Object.entries(SOURCE_COLORS).map(([type, { color, label }]) => (
          <View key={type} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={[styles.legendText, { color }]}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Navigation Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolbarButton, chapter <= 1 && styles.toolbarButtonDisabled]}
          onPress={goToPreviousChapter}
          disabled={chapter <= 1}
        >
          <Text style={[styles.toolbarButtonText, chapter <= 1 && styles.toolbarButtonTextDisabled]}>
            ‹ Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.chapterSelector}
          onPress={() => router.push(`/books/${bookId}/chapters`)}
        >
          <Text style={styles.chapterSelectorText}>
            Chapter {chapter} of {maxChapter}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolbarButton, chapter >= maxChapter && styles.toolbarButtonDisabled]}
          onPress={goToNextChapter}
          disabled={chapter >= maxChapter}
        >
          <Text style={[styles.toolbarButtonText, chapter >= maxChapter && styles.toolbarButtonTextDisabled]}>
            Next ›
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontSize: 17,
    color: Colors.tint,
    fontWeight: '500',
  },
  settingsPanel: {
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  settingsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.subtitle,
    marginBottom: 10,
  },
  fontSizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  fontSizeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  fontSizeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 15,
  },
  sphereToggles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  sphereToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.separator,
    marginRight: 8,
    marginBottom: 8,
  },
  sphereDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  sphereToggleText: {
    fontSize: 13,
    color: Colors.subtitle,
  },
  swipeHint: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  swipeHintText: {
    fontSize: 12,
    color: Colors.subtitle,
  },
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingVertical: 15,
    paddingRight: 15,
  },
  verseRow: {
    flexDirection: 'row',
    marginLeft: -SOURCE_COLUMN_WIDTH,
  },
  sourceColumn: {
    width: SOURCE_COLUMN_WIDTH,
    paddingRight: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  sourceLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9B9B9B',
    textTransform: 'uppercase',
    marginRight: 4,
  },
  sourceOccurrence: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.tint,
  },
  textColumn: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  verseText: {
    fontFamily: 'Georgia',
    lineHeight: 26,
  },
  verseNum: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '600',
    color: Colors.tint,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.separator,
    backgroundColor: '#F9F9F9',
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
    fontWeight: '500',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.separator,
    backgroundColor: '#FFFFFF',
  },
  toolbarButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  toolbarButtonDisabled: {
    opacity: 0.5,
  },
  toolbarButtonText: {
    fontSize: 16,
    color: Colors.tint,
  },
  toolbarButtonTextDisabled: {
    color: Colors.subtitle,
  },
  chapterSelector: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chapterSelectorText: {
    fontSize: 14,
    color: Colors.subtitle,
  },
});
