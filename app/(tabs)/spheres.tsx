/**
 * Spheres Screen
 * 
 * Display of the 7 spheres of life in a circular arrangement.
 * Ported from legacy/App/js/Scenes/Spheres/Spheres.js
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
// LinearGradient removed - requires native rebuild
import { Colors, formatNumber } from '../../src/common';
import { Icon } from '../../src/components';
import { useSpheres, useDatabase } from '../../src/database/provider';
import { Sphere } from '../../src/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH - 80, 280);
const SPHERE_ICON_SIZE = 60;

// Calculate positions for spheres in a circle
function getCirclePosition(index: number, total: number, radius: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return { x, y };
}

interface SphereCircleProps {
  sphere: Sphere;
  position: { x: number; y: number };
  onPress: () => void;
  isSelected: boolean;
}

function SphereCircle({ sphere, position, onPress, isSelected }: SphereCircleProps) {
  const sphereColors = Colors.spheres[sphere.id as keyof typeof Colors.spheres] || Colors.spheres.family;

  return (
    <TouchableOpacity
      style={[
        styles.sphereCircle,
        {
          transform: [
            { translateX: position.x - SPHERE_ICON_SIZE / 2 },
            { translateY: position.y - SPHERE_ICON_SIZE / 2 },
          ],
        },
        isSelected && styles.sphereCircleSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.sphereGradient, { backgroundColor: sphereColors.tint || '#666' }]}>
        <Icon
          name={`${sphere.id}-filled`}
          size={30}
          color="#FFFFFF"
        />
      </View>
    </TouchableOpacity>
  );
}

export default function SpheresScreen() {
  const router = useRouter();
  const { spheres, getSpherePassages, isLoading } = useSpheres();
  const { totalWordCount } = useDatabase();
  const [selectedSphere, setSelectedSphere] = useState<string | null>(null);

  const radius = CIRCLE_SIZE / 2 - SPHERE_ICON_SIZE / 2;

  const selectedData = selectedSphere
    ? spheres.find(s => s.id === selectedSphere)
    : null;

  const selectedPassages = selectedSphere
    ? getSpherePassages(selectedSphere)
    : [];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.tint} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Circle Visualization */}
      <View style={styles.circleContainer}>
        <View style={[styles.circle, { width: CIRCLE_SIZE, height: CIRCLE_SIZE }]}>
          {/* Center text */}
          <View style={styles.centerContent}>
            {selectedData ? (
              <>
                <Text style={styles.centerTitle}>{selectedData.name}</Text>
                <Text style={styles.centerSubtitle}>
                  {Math.round(((selectedData.wordCount || 0) / (totalWordCount || 1)) * 100)}% of Bible
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.centerTitle}>Spheres</Text>
                <Text style={styles.centerSubtitle}>Tap to explore</Text>
              </>
            )}
          </View>

          {/* Sphere icons */}
          {spheres.map((sphere, index) => {
            const position = getCirclePosition(index, spheres.length, radius);
            return (
              <SphereCircle
                key={sphere.id}
                sphere={sphere}
                position={position}
                isSelected={selectedSphere === sphere.id}
                onPress={() => {
                  if (selectedSphere === sphere.id) {
                    router.push(`/spheres/${sphere.id}`);
                  } else {
                    setSelectedSphere(sphere.id);
                  }
                }}
              />
            );
          })}
        </View>
      </View>

      {/* Instructions */}
      <Text style={styles.instructions}>
        Tap a sphere to see details, tap again to explore
      </Text>

      {/* Selected Sphere Details */}
      {selectedData && (
        <View style={styles.detailsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.spheres[selectedData.id as keyof typeof Colors.spheres]?.tint || Colors.tint }]}>
                {selectedData.sourceCount || 0}
              </Text>
              <Text style={styles.statLabel}>Sources</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.spheres[selectedData.id as keyof typeof Colors.spheres]?.tint || Colors.tint }]}>
                {formatNumber(selectedData.wordCount || 0)}
              </Text>
              <Text style={styles.statLabel}>Words</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.spheres[selectedData.id as keyof typeof Colors.spheres]?.tint || Colors.tint }]}>
                {selectedPassages.length}
              </Text>
              <Text style={styles.statLabel}>Key Passages</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.exploreButton, { backgroundColor: Colors.spheres[selectedData.id as keyof typeof Colors.spheres]?.tint || Colors.tint }]}
            onPress={() => router.push(`/spheres/${selectedData.id}`)}
          >
            <Text style={styles.exploreButtonText}>Explore {selectedData.name}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* All Spheres List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>ALL SPHERES</Text>
        {spheres.map((sphere) => {
          const sphereColors = Colors.spheres[sphere.id as keyof typeof Colors.spheres] || Colors.spheres.family;
          const percent = Math.round(((sphere.wordCount || 0) / (totalWordCount || 1)) * 100);

          return (
            <TouchableOpacity
              key={sphere.id}
              style={styles.listItem}
              onPress={() => router.push(`/spheres/${sphere.id}`)}
              activeOpacity={0.7}
            >
              <View style={[styles.listDot, { backgroundColor: sphereColors.tint }]} />
              <Text style={styles.listName}>{sphere.name}</Text>
              <Text style={styles.listPercent}>{percent}%</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  contentContainer: {
    paddingBottom: 30,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  circle: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
  },
  centerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
  },
  centerSubtitle: {
    fontSize: 14,
    color: Colors.subtitle,
    marginTop: 4,
  },
  sphereCircle: {
    position: 'absolute',
    width: SPHERE_ICON_SIZE,
    height: SPHERE_ICON_SIZE,
  },
  sphereCircleSelected: {
    transform: [{ scale: 1.2 }],
  },
  sphereGradient: {
    width: '100%',
    height: '100%',
    borderRadius: SPHERE_ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  instructions: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.subtitle,
    marginBottom: 20,
  },
  detailsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.subtitle,
    marginTop: 2,
  },
  exploreButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.subtitle,
    letterSpacing: 1,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  listDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  listName: {
    flex: 1,
    fontSize: 17,
    color: Colors.text,
  },
  listPercent: {
    fontSize: 14,
    color: Colors.subtitle,
    marginRight: 10,
  },
  arrow: {
    fontSize: 22,
    color: Colors.separator,
  },
});
