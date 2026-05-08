import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '@/constants/theme';

type BadgeStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'new';

type Props = {
  status: BadgeStatus;
  style?: ViewStyle;
};

const config: Record<BadgeStatus, { label: string; bg: string; text: string; dot: string }> = {
  confirmed:  { label: 'Confirmado',  bg: '#CCFBF1', text: '#0D9488', dot: '#2DD4BF' },
  pending:    { label: 'Pendente',    bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' },
  cancelled:  { label: 'Cancelado',  bg: '#FEE2E2', text: '#DC2626', dot: '#EF4444' },
  completed:  { label: 'Concluído',  bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' },
  new:        { label: 'Novo',       bg: '#EDE9FF', text: '#6C63FF', dot: '#6C63FF' },
};

export function Badge({ status, style }: Props) {
  const c = config[status];
  return (
    <View style={[styles.container, { backgroundColor: c.bg }, style]}>
      <View style={[styles.dot, { backgroundColor: c.dot }]} />
      <Text style={[styles.label, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 5,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
