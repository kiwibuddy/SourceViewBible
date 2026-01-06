import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart, WordCloud } from '../../src/components';
import { Colors } from '../../src/common/colors';

// Sample data for charts
const SOURCE_DATA = [
  { value: 45, color: Colors.sources.narrator.tint, label: 'Narrator' },
  { value: 25, color: Colors.sources.divine.tint, label: 'Divine' },
  { value: 20, color: Colors.sources.lead.tint, label: 'Lead' },
  { value: 10, color: Colors.sources.support.tint, label: 'Support' },
];

const SPHERE_DATA = [
  { value: 120, label: 'Religion', color: Colors.spheres.religion.tint },
  { value: 52, label: 'Government', color: Colors.spheres.government.tint },
  { value: 45, label: 'Family', color: Colors.spheres.family.tint },
  { value: 38, label: 'Economics', color: Colors.spheres.economics.tint },
  { value: 32, label: 'Education', color: Colors.spheres.education.tint },
  { value: 28, label: 'Communication', color: Colors.spheres.communication.tint },
  { value: 25, label: 'Celebration', color: Colors.spheres.celebration.tint },
];

const WORD_DATA = [
  { word: 'God', count: 4500 },
  { word: 'Lord', count: 3200 },
  { word: 'said', count: 2800 },
  { word: 'people', count: 2100 },
  { word: 'Israel', count: 1900 },
  { word: 'king', count: 1600 },
  { word: 'man', count: 1500 },
  { word: 'son', count: 1400 },
  { word: 'land', count: 1300 },
  { word: 'day', count: 1200 },
  { word: 'house', count: 1100 },
  { word: 'came', count: 1000 },
];

export default function DiscoveryCenterScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Discovery Center',
          headerLargeTitle: true,
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Discovery Center</Text>
          <Text style={styles.subtitle}>
            Explore patterns and insights across the Bible
          </Text>
        </View>

        {/* Sources Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Who Speaks?</Text>
          <Text style={styles.cardSubtitle}>Distribution of speech by source type</Text>
          <View style={styles.chartContainer}>
            <PieChart 
              data={SOURCE_DATA} 
              size={180} 
              innerRadius={50}
            />
          </View>
          <View style={styles.legend}>
            {SOURCE_DATA.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendValue}>{item.value}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Spheres Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spheres Coverage</Text>
          <Text style={styles.cardSubtitle}>Word count by sphere</Text>
          <View style={styles.chartContainer}>
            <BarChart 
              data={SPHERE_DATA} 
              horizontal 
              height={280}
            />
          </View>
        </View>

        {/* Word Cloud */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Common Words</Text>
          <Text style={styles.cardSubtitle}>Most frequent words in the Bible</Text>
          <WordCloud 
            data={WORD_DATA} 
            maxWords={12}
            minFontSize={14}
            maxFontSize={28}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="filter" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Add Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Export Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  legend: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  legendValue: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
});

