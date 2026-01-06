/**
 * ListItem Component
 * 
 * A reusable list item component for displaying items in lists.
 */

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '../common/colors';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  showDisclosure?: boolean;
  showSeparator?: boolean;
}

export function ListItem({
  title,
  subtitle,
  leftComponent,
  rightComponent,
  onPress,
  style,
  showDisclosure = true,
  showSeparator = true,
}: ListItemProps) {
  const content = (
    <View style={styles.container}>
      {leftComponent && <View style={styles.leftContainer}>{leftComponent}</View>}
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent && <View style={styles.rightContainer}>{rightComponent}</View>}
      {showDisclosure && !rightComponent && (
        <Text style={styles.disclosure}>›</Text>
      )}
    </View>
  );

  const wrapper = onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  ) : (
    content
  );

  return (
    <View style={style}>
      {wrapper}
      {showSeparator && <View style={styles.separator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    minHeight: 44,
    backgroundColor: '#FFFFFF',
  },
  leftContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  rightContainer: {
    marginLeft: 8,
  },
  title: {
    fontSize: 17,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.subtitle,
    marginTop: 2,
  },
  disclosure: {
    fontSize: 22,
    color: Colors.separator,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginLeft: 15,
  },
});

export default ListItem;
