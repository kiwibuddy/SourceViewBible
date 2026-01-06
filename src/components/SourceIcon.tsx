/**
 * SourceIcon Component
 * 
 * Displays an avatar icon for a source (actant) based on their type.
 * Ported from legacy/App/js/Components/Common/SourceIcon.js
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
// LinearGradient removed - requires native rebuild
import { Icon } from './Icon';
import { Colors } from '../common/colors';

interface Source {
  iconName?: string;
  principalSourceType?: string;
  isDivine?: boolean;
  isHuman?: boolean;
  isIndividual?: boolean;
  hasGender?: boolean;
  isFemale?: boolean;
  isAngelic?: boolean;
  isDemonic?: boolean;
}

interface SourceIconProps {
  source?: Source;
  principalSourceType?: string;
  size?: number;
  style?: ViewStyle;
  showBackground?: boolean;
}

// Determine icon name based on source properties
function getIconName(source?: Source): string {
  if (!source) return 'avatar-other';
  
  if (source.iconName) return source.iconName;
  
  if (source.isDivine) return 'avatar-divine';
  if (source.isHuman) {
    if (source.isIndividual && source.hasGender) {
      return source.isFemale ? 'avatar-human-female' : 'avatar-human-male';
    }
    return 'avatar-human-group';
  }
  if (source.isAngelic) return 'avatar-angelic';
  if (source.isDemonic) return 'avatar-demonic';
  if (source.principalSourceType === 'narrator') return 'avatar-narrator';
  
  return 'avatar-other';
}

// Get colors based on source type
function getSourceColors(principalSourceType?: string) {
  const type = principalSourceType || 'other';
  const colors = Colors.sources[type as keyof typeof Colors.sources] || Colors.sources.other;
  return colors;
}

export function SourceIcon({
  source,
  principalSourceType,
  size = 40,
  style,
  showBackground = true,
}: SourceIconProps) {
  const iconName = getIconName(source);
  const colors = getSourceColors(principalSourceType || source?.principalSourceType);
  const iconSize = size * 0.6;

  if (showBackground) {
    // Use first color from gradient as solid background
    const backgroundColor = colors.gradient?.big?.[0] || colors.tint;
    
    return (
      <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
        <View
          style={[styles.gradient, { borderRadius: size / 2, backgroundColor }]}
        >
          <Icon
            name={iconName}
            size={iconSize}
            color="#FFFFFF"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.iconOnly, { width: size, height: size }, style]}>
      <Icon
        name={iconName}
        size={iconSize}
        color={colors.tint}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOnly: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SourceIcon;
