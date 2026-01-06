import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Stack } from 'expo-router';
import Constants from 'expo-constants';

export default function AboutScreen() {
  const version = Constants.expoConfig?.version || '2.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || '2617';

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'About',
          presentation: 'modal',
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>SV</Text>
          </View>
          <Text style={styles.appName}>SourceView Bible</Text>
          <Text style={styles.version}>Version {version} ({buildNumber})</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>
            SourceView Bible is a unique Bible study tool that helps you discover 
            the Scriptures through two powerful lenses: Sources (who speaks in the Bible) 
            and Spheres (thematic categories covering all areas of life).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Explore all 66 books of the Bible</Text>
            <Text style={styles.featureItem}>• See who is speaking in each passage</Text>
            <Text style={styles.featureItem}>• Discover content by 7 Spheres of society</Text>
            <Text style={styles.featureItem}>• Word cloud visualizations</Text>
            <Text style={styles.featureItem}>• Discovery Center for deep analysis</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bible Translation</Text>
          <Text style={styles.sectionText}>
            Scripture quotations are taken from the Holy Bible, New Living Translation, 
            copyright ©1996, 2004, 2015 by Tyndale House Foundation. Used by permission 
            of Tyndale House Publishers, Carol Stream, Illinois 60188. All rights reserved.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links</Text>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => Linking.openURL('https://apps.apple.com/us/app/sourceview-bible/id1114617271')}
          >
            <Text style={styles.linkText}>Rate on App Store</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2016-2026 SourceView Bible</Text>
          <Text style={styles.footerText}>Originally launched in 2016</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 24,
  },
  featureList: {
    gap: 6,
  },
  featureItem: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
  },
  linkButton: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  linkText: {
    fontSize: 16,
    color: '#6366f1',
    textAlign: 'center',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
});

