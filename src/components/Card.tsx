/**
 * Card Component
 * 
 * A reusable card component for displaying content in a card layout.
 */

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../common/colors';

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  gradientColors?: string[];
  image?: ImageSourcePropType;
}

export function Card({
  title,
  subtitle,
  children,
  onPress,
  style,
  gradientColors,
  image,
}: CardProps) {
  const content = (
    <>
      {image && <Image source={image} style={styles.image} />}
      {gradientColors ? (
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {title && <Text style={styles.titleWhite}>{title}</Text>}
            {subtitle && <Text style={styles.subtitleWhite}>{subtitle}</Text>}
            {children}
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.content}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {children}
        </View>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.container, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 4,
    minHeight: 100,
  },
  gradient: {
    flex: 1,
    padding: 12,
  },
  content: {
    padding: 12,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  titleWhite: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.subtitle,
  },
  subtitleWhite: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default Card;
