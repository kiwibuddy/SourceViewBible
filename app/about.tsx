/**
 * About Screen
 * 
 * Information about SourceView Bible.
 * Ported from legacy/App/js/Scenes/About/About.js
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Constants from 'expo-constants';
import { Colors } from '../src/common';
import { Icon } from '../src/components';

interface AboutItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

function AboutItem({ icon, title, subtitle, onPress }: AboutItemProps) {
  return (
    <TouchableOpacity style={styles.aboutItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.aboutIconContainer}>
        <Icon name={icon} size={24} color={Colors.tint} />
      </View>
      <View style={styles.aboutContent}>
        <Text style={styles.aboutTitle}>{title}</Text>
        {subtitle && <Text style={styles.aboutSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function AboutScreen() {
  const router = useRouter();

  const handleOpenURL = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'About SourceView' }} />

      {/* App Info */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Icon name="books-filled" size={60} color={Colors.tint} />
        </View>
        <Text style={styles.appName}>SourceView Bible</Text>
        <Text style={styles.version}>
          Version {Constants.expoConfig?.version || '2.0.0'}
        </Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.description}>
          SourceView Bible helps you explore Scripture through the lens of who is speaking
          and how their words relate to the seven spheres of life. Discover deeper insights
          as you study the Word of God.
        </Text>
      </View>

      {/* Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONNECT</Text>

        <AboutItem
          icon="about-web"
          title="Visit Website"
          subtitle="sourceviewbible.com"
          onPress={() => handleOpenURL('https://sourceviewbible.com')}
        />

        <AboutItem
          icon="about-fb"
          title="Facebook"
          subtitle="Follow us for updates"
          onPress={() => handleOpenURL('https://facebook.com/sourceviewbible')}
        />

        <AboutItem
          icon="about-twitter"
          title="Twitter"
          subtitle="@sourceviewbible"
          onPress={() => handleOpenURL('https://twitter.com/sourceviewbible')}
        />

        <AboutItem
          icon="about-contact"
          title="Contact Us"
          subtitle="Send feedback or questions"
          onPress={() => handleOpenURL('mailto:support@sourceviewbible.com')}
        />
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LEGAL</Text>

        <AboutItem
          icon="about-info"
          title="Terms of Service"
          onPress={() => handleOpenURL('https://sourceviewbible.com/terms')}
        />

        <AboutItem
          icon="about-info"
          title="Privacy Policy"
          onPress={() => handleOpenURL('https://sourceviewbible.com/privacy')}
        />

        <AboutItem
          icon="about-info"
          title="Acknowledgments"
          onPress={() => router.push('/acknowledgments')}
        />
      </View>

      {/* Bible Translation Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>BIBLE TRANSLATION</Text>
        <View style={styles.translationInfo}>
          <Text style={styles.translationName}>New Living Translation (NLT)</Text>
          <Text style={styles.translationCopyright}>
            Scripture quotations are taken from the Holy Bible, New Living Translation,
            copyright © 1996, 2004, 2015 by Tyndale House Foundation. Used by permission
            of Tyndale House Publishers, Inc., Carol Stream, Illinois 60188. All rights reserved.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.copyright}>© 2016-2026 SourceView Publishing, LLC</Text>
        <Text style={styles.footerText}>Made with ♥ for Bible study</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  version: {
    fontSize: 14,
    color: Colors.subtitle,
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.subtitle,
    letterSpacing: 1,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  aboutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aboutContent: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 17,
    color: Colors.text,
  },
  aboutSubtitle: {
    fontSize: 13,
    color: Colors.subtitle,
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    color: Colors.separator,
  },
  translationInfo: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 8,
  },
  translationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  translationCopyright: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.subtitle,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  copyright: {
    fontSize: 13,
    color: Colors.subtitle,
  },
  footerText: {
    fontSize: 13,
    color: Colors.subtitle,
    marginTop: 5,
  },
});
