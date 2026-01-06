/**
 * Bible Reader Screen
 * 
 * Displays scripture text with sphere highlighting and source indicators.
 * Ported from legacy/App/js/Scenes/Reader/Reader.js
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors, SphereNames } from '../../src/common';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Mock scripture content - will be replaced with Emdros database queries
const MOCK_SCRIPTURE: Record<string, any> = {
  genesis: {
    1: {
      title: 'Genesis 1',
      content: `
        <p class="verse"><span class="verse-num">1</span>In the beginning God created the heavens and the earth.</p>
        <p class="verse"><span class="verse-num">2</span>The earth was formless and empty, and darkness covered the deep waters. And the Spirit of God was hovering over the surface of the waters.</p>
        <p class="verse"><span class="verse-num">3</span><span class="source-god">Then God said, "Let there be light,"</span> and there was light.</p>
        <p class="verse"><span class="verse-num">4</span>And God saw that the light was good. Then he separated the light from the darkness.</p>
        <p class="verse"><span class="verse-num">5</span><span class="source-god">God called the light "day" and the darkness "night."</span> And evening passed and morning came, marking the first day.</p>
        <p class="verse sphere-religion"><span class="verse-num">6</span><span class="source-god">Then God said, "Let there be a space between the waters, to separate the waters of the heavens from the waters of the earth."</span></p>
        <p class="verse"><span class="verse-num">7</span>And that is what happened. God made this space to separate the waters of the earth from the waters of the heavens.</p>
        <p class="verse"><span class="verse-num">8</span><span class="source-god">God called the space "sky."</span> And evening passed and morning came, marking the second day.</p>
      `,
    },
    2: {
      title: 'Genesis 2',
      content: `
        <p class="verse"><span class="verse-num">1</span>So the creation of the heavens and the earth and everything in them was completed.</p>
        <p class="verse sphere-celebration"><span class="verse-num">2</span>On the seventh day God had finished his work of creation, so he rested from all his work.</p>
        <p class="verse sphere-religion"><span class="verse-num">3</span>And God blessed the seventh day and declared it holy, because it was the day when he rested from all his work of creation.</p>
        <p class="verse"><span class="verse-num">4</span>This is the account of the creation of the heavens and the earth.</p>
      `,
    },
  },
  matthew: {
    1: {
      title: 'Matthew 1',
      content: `
        <p class="verse"><span class="verse-num">1</span>This is a record of the ancestors of Jesus the Messiah, a descendant of David and of Abraham:</p>
        <p class="verse"><span class="verse-num">2</span>Abraham was the father of Isaac. Isaac was the father of Jacob. Jacob was the father of Judah and his brothers.</p>
        <p class="verse"><span class="verse-num">3</span>Judah was the father of Perez and Zerah (whose mother was Tamar). Perez was the father of Hezron. Hezron was the father of Ram.</p>
      `,
    },
  },
};

// Generate HTML for the WebView
function generateReaderHTML(content: string, fontSize: number, sphereSettings: Record<string, boolean>) {
  const sphereCSS = Object.entries(Colors.spheres)
    .map(([sphere, colors]) => {
      const isEnabled = sphereSettings[sphere] !== false;
      return `.sphere-${sphere} { background-color: ${isEnabled ? colors.highlightTint : 'transparent'}; }`;
    })
    .join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * {
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: ${fontSize}px;
          line-height: 1.65;
          color: #333;
          padding: 15px;
          margin: 0;
          background: #fff;
        }
        .verse {
          margin: 0 0 12px 0;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .verse-num {
          font-size: 0.7em;
          font-weight: 600;
          color: ${Colors.tint};
          vertical-align: super;
          margin-right: 4px;
        }
        .source-god {
          color: ${Colors.sources.god.tint};
        }
        .source-narrator {
          color: ${Colors.sources.narrator.tint};
        }
        .source-lead {
          color: ${Colors.sources.lead.tint};
        }
        .source-support {
          color: ${Colors.sources.support.tint};
        }
        ${sphereCSS}
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
}

export default function ReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);

  const [chapter, setChapter] = useState(1);
  const [fontSize, setFontSize] = useState(17);
  const [showSettings, setShowSettings] = useState(false);
  const [sphereSettings, setSphereSettings] = useState<Record<string, boolean>>({
    family: true,
    economics: true,
    government: true,
    religion: true,
    education: true,
    communication: true,
    celebration: true,
  });

  // Get book data
  const bookData = MOCK_SCRIPTURE[bookId || 'genesis'] || MOCK_SCRIPTURE.genesis;
  const chapterData = bookData[chapter] || bookData[1];
  const maxChapter = Object.keys(bookData).length;

  // Generate HTML content
  const htmlContent = generateReaderHTML(chapterData.content, fontSize, sphereSettings);

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
                    isEnabled && { backgroundColor: sphereColors.lightTint, borderColor: sphereColors.tint },
                  ]}
                  onPress={() => toggleSphere(sphere)}
                >
                  <View style={[styles.sphereDot, { backgroundColor: sphereColors.tint }]} />
                  <Text style={[styles.sphereToggleText, isEnabled && { color: sphereColors.tint }]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Scripture Content */}
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webView}
        originWhitelist={['*']}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />

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
  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
