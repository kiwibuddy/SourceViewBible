/**
 * Book Spheres Screen
 * Placeholder - shows sphere distribution in a book
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../src/common';

export default function BookSpheresScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.placeholder}>
        Sphere distribution for {bookId || 'this book'} will be displayed here.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  placeholder: {
    fontSize: 16,
    color: Colors.subtitle,
    textAlign: 'center',
    marginTop: 50,
  },
});
