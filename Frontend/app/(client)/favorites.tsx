import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import { router } from 'expo-router';
import { PROFESSIONALS } from '@/constants/mock-data';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const favorites = PROFESSIONALS.slice(0, 3);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <Text style={styles.headerCount}>{favorites.length} profissionais</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {favorites.map((pro) => (
          <TouchableOpacity
            key={pro.id}
            style={styles.card}
            onPress={() => router.push(`/(client)/professional/${pro.id}` as any)}
            activeOpacity={0.9}
          >
            <View style={styles.cardLeft}>
              <Avatar initials={pro.avatar} size="lg" />
              <View style={styles.heartBadge}>
                <Ionicons name="heart" size={14} color={Colors.error} />
              </View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.proName}>{pro.name}</Text>
              <Text style={styles.proSpec}>{pro.specialty}</Text>
              <StarRating rating={pro.rating} reviewCount={pro.reviewCount} size={12} />
              <View style={styles.metaRow}>
                <View style={styles.meta}>
                  <Ionicons name="location-outline" size={11} color={Colors.textMuted} />
                  <Text style={styles.metaTxt}>{pro.distance}</Text>
                </View>
                <Text style={styles.price}>A partir de <Text style={styles.priceVal}>R${pro.startingPrice}</Text></Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        {favorites.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Sem favoritos</Text>
            <Text style={styles.emptyDesc}>Adicione profissionais aos favoritos para encontrá-los rapidamente.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  headerCount: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: 30 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md, ...Shadow.sm },
  cardLeft: { position: 'relative' },
  heartBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#fff', borderRadius: 12, padding: 2 },
  cardInfo: { flex: 1, gap: 3 },
  proName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  proSpec: { fontSize: 12, color: Colors.textSecondary },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaTxt: { fontSize: 11, color: Colors.textMuted },
  price: { fontSize: 11, color: Colors.textMuted },
  priceVal: { fontWeight: '700', color: Colors.primary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptyDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 20 },
});
