import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import { GradientButton } from '@/components/ui/gradient-button';
import { PROFESSIONALS } from '@/constants/mock-data';

export default function ProfessionalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const pro = PROFESSIONALS.find((p) => p.id === id) || PROFESSIONALS[0];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={[styles.hero, { paddingTop: insets.top + 10 }]}>
          <View style={styles.circle1} />
          <View style={styles.heroNav}>
            <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFavorited(!favorited)} style={styles.navBtn}>
              <Ionicons name={favorited ? 'heart' : 'heart-outline'} size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileCenter}>
            <View style={styles.avatarWrap}>
              <Avatar initials={pro.avatar} size="xl" />
              <View style={styles.verifiedDot}><Ionicons name="checkmark-circle" size={22} color={Colors.success} /></View>
            </View>
            <Text style={styles.heroName}>{pro.name}</Text>
            <Text style={styles.heroSpec}>{pro.specialty}</Text>
            <StarRating rating={pro.rating} reviewCount={pro.reviewCount} size={13} />
            <View style={styles.locRow}>
              <Ionicons name="location" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.locText}>{pro.location}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          {[
            { icon: 'star', v: pro.rating.toFixed(1), l: 'Avaliação', c: '#F59E0B' },
            { icon: 'people', v: `${pro.reviewCount}`, l: 'Avaliações', c: '#6C63FF' },
            { icon: 'location', v: pro.distance, l: 'Distância', c: '#10B981' },
          ].map((s) => (
            <View key={s.l} style={[styles.statCard, { borderTopColor: s.c }]}>
              <Ionicons name={s.icon as any} size={18} color={s.c} />
              <Text style={styles.statV}>{s.v}</Text>
              <Text style={styles.statL}>{s.l}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sec}>
          <Text style={styles.secTitle}>Sobre</Text>
          <Text style={styles.about}>{pro.about}</Text>
        </View>

        <View style={styles.sec}>
          <Text style={styles.secTitle}>Serviços</Text>
          {pro.services.map((sv) => (
            <TouchableOpacity
              key={sv.id}
              style={[styles.svcCard, selectedService === sv.id && styles.svcCardSel]}
              onPress={() => setSelectedService(selectedService === sv.id ? null : sv.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.radio, selectedService === sv.id && styles.radioActive]}>
                {selectedService === sv.id && <View style={styles.radioInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.svcName}>{sv.name}</Text>
                <Text style={styles.svcDesc}>{sv.description}</Text>
                <View style={styles.svcMeta}>
                  <Ionicons name="time-outline" size={11} color={Colors.textMuted} />
                  <Text style={styles.svcMetaTxt}>{sv.duration}</Text>
                </View>
              </View>
              <Text style={styles.svcPrice}>R$ {sv.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sec}>
          <Text style={styles.secTitle}>Disponibilidade — Hoje</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {pro.availableSlots.map((slot) => (
              <TouchableOpacity key={slot} style={styles.slotChip}>
                <Text style={styles.slotTxt}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sec}>
          <Text style={styles.secTitle}>Avaliações</Text>
          {pro.reviews.map((rv) => (
            <View key={rv.id} style={styles.rvCard}>
              <View style={styles.rvHeader}>
                <Avatar initials={rv.avatar} size="sm" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rvName}>{rv.clientName}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
                    <StarRating rating={rv.rating} size={12} showNumber={false} />
                    <Text style={styles.rvDate}>{rv.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.rvComment}>{rv.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomCta, { paddingBottom: insets.bottom + 16 }]}>
        <View>
          <Text style={{ fontSize: 11, color: Colors.textMuted }}>A partir de</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.primary }}>R$ {pro.startingPrice}</Text>
        </View>
        <GradientButton title="Agendar Agora" onPress={() => router.push('/(client)/booking' as any)} fullWidth={false} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: { paddingBottom: 30, overflow: 'hidden' },
  circle1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.06)', top: -60, right: -40 },
  heroNav: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  navBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  profileCenter: { alignItems: 'center', paddingHorizontal: Spacing.lg },
  avatarWrap: { position: 'relative', marginBottom: Spacing.sm },
  verifiedDot: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#fff', borderRadius: 12 },
  heroName: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  heroSpec: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  locText: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  statsRow: { flexDirection: 'row', marginHorizontal: Spacing.lg, gap: Spacing.sm, marginTop: -20 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', gap: 4, borderTopWidth: 3, ...Shadow.md },
  statV: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  statL: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500' },
  sec: { marginTop: Spacing.lg, paddingHorizontal: Spacing.lg },
  secTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  about: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  svcCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: 'transparent', ...Shadow.sm },
  svcCardSel: { borderColor: Colors.primary, backgroundColor: Colors.infoLight },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  svcName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  svcDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  svcMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  svcMetaTxt: { fontSize: 11, color: Colors.textMuted },
  svcPrice: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  slotChip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, ...Shadow.sm },
  slotTxt: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  rvCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm },
  rvHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  rvName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  rvDate: { fontSize: 11, color: Colors.textMuted },
  rvComment: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  bottomCta: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border, ...Shadow.lg },
});
