import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <Text style={styles.headerCount}>0 profissionais</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={56} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Sem favoritos ainda</Text>
          <Text style={styles.emptyDesc}>
            Adicione profissionais aos favoritos para encontrá-los rapidamente na sua próxima visita.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  headerCount: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  content: { flex: 1, paddingHorizontal: Spacing.lg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 16 },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 22,
  },
});
