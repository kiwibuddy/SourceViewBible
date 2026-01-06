/**
 * Sphere Passages Screen
 * Placeholder - shows 52 key passages for a sphere
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, SphereNames } from '../../../src/common';

export default function SpherePassagesScreen() {
  const { sphereId } = useLocalSearchParams<{ sphereId: string }>();
  const sphereName = SphereNames[sphereId || ''] || sphereId || 'Sphere';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.placeholder}>
        52 key passages for {sphereName} will be displayed here.
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
