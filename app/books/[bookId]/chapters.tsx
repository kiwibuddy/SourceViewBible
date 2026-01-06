/**
 * Book Chapters Screen
 * Placeholder - shows list of chapters for a book
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../src/common';

const MOCK_CHAPTERS = Array.from({ length: 50 }, (_, i) => ({
  number: i + 1,
  verseCount: Math.floor(Math.random() * 30) + 10,
}));

export default function BookChaptersScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();

  return (
    <FlatList
      data={MOCK_CHAPTERS}
      keyExtractor={(item) => item.number.toString()}
      numColumns={5}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.chapterItem}
          onPress={() => router.push(`/reader/${bookId}?chapter=${item.number}`)}
        >
          <Text style={styles.chapterNumber}>{item.number}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  chapterItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.separator,
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.tint,
  },
});
