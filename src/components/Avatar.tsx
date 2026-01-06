import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarProps {
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const SIZES = {
  small: { container: 32, icon: 16 },
  medium: { container: 48, icon: 24 },
  large: { container: 80, icon: 40 },
};

export function Avatar({ 
  icon = 'person', 
  color = '#6366f1', 
  size = 'medium',
  style 
}: AvatarProps) {
  const dimensions = SIZES[size];
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          width: dimensions.container, 
          height: dimensions.container, 
          borderRadius: dimensions.container / 2,
          backgroundColor: color,
        },
        style
      ]}
    >
      <Ionicons name={icon} size={dimensions.icon} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

