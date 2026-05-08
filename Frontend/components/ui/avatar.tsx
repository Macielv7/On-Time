import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '@/constants/theme';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

type Props = {
  initials: string;
  size?: AvatarSize;
  backgroundColor?: string;
  style?: ViewStyle;
};

const sizes = {
  sm: { container: 36, fontSize: 13 },
  md: { container: 48, fontSize: 16 },
  lg: { container: 64, fontSize: 22 },
  xl: { container: 88, fontSize: 30 },
};

const bgColors = ['#6C63FF', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

function getColor(initials: string) {
  const idx = initials.charCodeAt(0) % bgColors.length;
  return bgColors[idx];
}

export function Avatar({ initials, size = 'md', backgroundColor, style }: Props) {
  const s = sizes[size];
  const bg = backgroundColor || getColor(initials);
  return (
    <View
      style={[
        styles.container,
        {
          width: s.container,
          height: s.container,
          borderRadius: s.container / 2,
          backgroundColor: bg,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: s.fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
