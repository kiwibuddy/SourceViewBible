/**
 * Custom Icon Component using sourceview.ttf font
 * 
 * Icon names and codes are from legacy/App/js/Images/font/config.json
 */

import React from 'react';
import { Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useFonts } from 'expo-font';

// Map icon names to unicode code points from sourceview.ttf
const ICON_MAP: Record<string, number> = {
  // Books icon
  'books-filled': 0xe800,
  'books': 0xe81e,
  
  // Avatar icons
  'avatar-divine': 0xe803,
  'avatar-human-male': 0xe804,
  'avatar-human-female': 0xe805,
  'avatar-human-group': 0xe802,
  'avatar-angelic': 0xe80e,
  'avatar-more': 0xe806,
  'avatar-other': 0xe807,
  'avatar-demonic': 0xe808,
  'avatar-narrator': 0xe801,
  
  // Sphere icons (filled)
  'family-filled': 0xe80f,
  'economics-filled': 0xe810,
  'government-filled': 0xe819,
  'religion-filled': 0xe81d,
  'education-filled': 0xe812,
  'communication-filled': 0xe813,
  'celebration-filled': 0xe81c,
  
  // Metadata icons
  'metadata-timeperiod': 0xe809,
  'metadata-nature': 0xe80b,
  'metadata-role': 0xe80c,
  'metadata-gender': 0xe80d,
  'metadata-profession': 0xe81f,
  
  // About icons
  'about-rate-ios': 0xe80a,
  'about-rate-android': 0xe820,
  'about-contact': 0xe821,
  'about-donate': 0xe822,
  'about-fb': 0xe823,
  'about-twitter': 0xe824,
  'about-web': 0xe825,
  'about-info': 0xe826,
  'about-help': 0xe827,
};

interface IconProps {
  name: keyof typeof ICON_MAP | string;
  size?: number;
  color?: string;
  style?: TextStyle | ViewStyle;
}

export function Icon({ name, size = 24, color = '#000000', style }: IconProps) {
  const [fontsLoaded] = useFonts({
    'sourceview': require('../../assets/fonts/sourceview.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const codePoint = ICON_MAP[name];
  if (!codePoint) {
    console.warn(`Icon "${name}" not found in sourceview font`);
    return null;
  }

  const iconChar = String.fromCodePoint(codePoint);

  return (
    <Text
      style={[
        styles.icon,
        {
          fontSize: size,
          color,
          lineHeight: size * 1.2,
        },
        style,
      ]}
    >
      {iconChar}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontFamily: 'sourceview',
    textAlign: 'center',
  },
});

// Export icon names for reference
export const IconNames = Object.keys(ICON_MAP);

export default Icon;

