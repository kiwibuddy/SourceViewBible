/**
 * Discovery Center Screen
 * Placeholder - advanced filtering and charting
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../src/common';

export default function DiscoveryCenterScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.placeholder}>
        Advanced filtering and charting features will be available here.
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
