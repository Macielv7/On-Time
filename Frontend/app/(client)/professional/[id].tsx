import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { GradientButton } from '@/components/ui/gradient-button';
import { professionalsService, type Professional, type ServiceItem } from '@/services/professionals.service';

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function ProfessionalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [pro, setPro] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const fetchPro = useCallback(async () => {
    try {
      setLoading(true);
      const data = await professionalsService.getProfessional(Number(id));
      setPro(data);
    } catch (err) {
      console.error('Erro ao carregar profissional:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPro();
  }, [fetchPro]);

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!pro) {
    return (
      <View style={styles.loadingWrap}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.loadingText}>Profissional não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: Colors.primary, fontWeight: '600' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const initials = pro.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const minPrice = pro.services && pro.services.length > 0
    ? Math.min(...pro.services.map((s) => s.price))
    : null;

  const selectedSvcObj = pro.services?.find((s) => s.id === selectedService) ?? null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={[styles.hero, { paddingTop: insets.top + 10 }]}>
          <View style={styles.circle1} />
          <View style={styles.heroNav}>
            <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileCenter}>
            <View style={styles.avatarWrap}>
              <Avatar initials={initials} size="xl" />
              {pro.is_accepting === 1 && (
                <View style={styles.verifiedDot}>
                  <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
                </View>
              )}
            </View>
            <Text style={styles.heroName}>{pro.name}</Text>
            <Text style={styles.heroSpec}>{pro.specialty}</Text>
            {pro.city && (
              <View style={styles.locRow}>
                <Ionicons name="location" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.locText}>{pro.city}</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderTopColor: '#F59E0B' }]}>
            <Ionicons name="star" size={18} color="#F59E0B" />
            <Text style={styles.statV}>{pro.rating_avg > 0 ? pro.rating_avg.toFixed(1) : '—'}</Text>
            <Text style={styles.statL}>Avaliação</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: '#6C63FF' }]}>
            <Ionicons name="people" size={18} color="#6C63FF" />
            <Text style={styles.statV}>{pro.rating_count}</Text>
            <Text style={styles.statL}>Avaliações</Text>
          </View>
          {minPrice !== null && (
            <View style={[styles.statCard, { borderTopColor: '#10B981' }]}>
              <Ionicons name="pricetag" size={18} color="#10B981" />
              <Text style={styles.statV}>R${minPrice}</Text>
              <Text style={styles.statL}>A partir de</Text>
            </View>
          )}
        </View>

        {/* Sobre */}
        {pro.bio ? (
          <View style={styles.sec}>
            <Text style={styles.secTitle}>Sobre</Text>
            <Text style={styles.about}>{pro.bio}</Text>
          </View>
        ) : null}

        {/* Serviços */}
        {pro.services && pro.services.length > 0 && (
          <View style={styles.sec}>
            <Text style={styles.secTitle}>Serviços</Text>
            {pro.services.map((sv: ServiceItem) => (
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
                  {sv.description ? (
                    <Text style={styles.svcDesc}>{sv.description}</Text>
                  ) : null}
                  <View style={styles.svcMeta}>
                    <Ionicons name="time-outline" size={11} color={Colors.textMuted} />
                    <Text style={styles.svcMetaTxt}>{sv.duration_min} min</Text>
                  </View>
                </View>
                <Text style={styles.svcPrice}>R$ {sv.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Disponibilidade */}
        {pro.availability_slots && pro.availability_slots.length > 0 && (
          <View style={styles.sec}>
            <Text style={styles.secTitle}>Disponibilidade</Text>
            {pro.availability_slots.map((slot) => (
              <View key={slot.id} style={styles.slotRow}>
                <Text style={styles.slotDay}>{DAY_NAMES[slot.day_of_week]}</Text>
                <Text style={styles.slotTime}>{slot.start_time} – {slot.end_time}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Avaliações */}
        {pro.reviews && pro.reviews.length > 0 && (
          <View style={styles.sec}>
            <Text style={styles.secTitle}>Avaliações</Text>
            {pro.reviews.map((rv) => {
              const rvInitials = rv.client_name
                ? rv.client_name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
                : '?';
              return (
                <View key={rv.id} style={styles.rvCard}>
                  <View style={styles.rvHeader}>
                    <Avatar initials={rvInitials} size="sm" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rvName}>{rv.client_name}</Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
                        <View style={{ flexDirection: 'row', gap: 2 }}>
                          {[1,2,3,4,5].map((s) => (
                            <Ionicons key={s} name={s <= rv.rating ? 'star' : 'star-outline'} size={12} color="#F59E0B" />
                          ))}
                        </View>
                        <Text style={styles.rvDate}>{new Date(rv.created_at).toLocaleDateString('pt-BR')}</Text>
                      </View>
                    </View>
                  </View>
                  {rv.comment ? <Text style={styles.rvComment}>{rv.comment}</Text> : null}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Botão de agendamento */}
      <View style={[styles.bottomCta, { paddingBottom: insets.bottom + 16 }]}>
        {minPrice !== null && (
          <View>
            <Text style={{ fontSize: 11, color: Colors.textMuted }}>A partir de</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.primary }}>R$ {minPrice}</Text>
          </View>
        )}
        <GradientButton
          title="Agendar Agora"
          onPress={() =>
            router.push({
              pathname: '/(client)/booking',
              params: {
                professionalId: pro.id,
                serviceId: selectedService ?? undefined,
              },
            } as any)
          }
          fullWidth={false}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: Colors.background },
  loadingText: { fontSize: 14, color: Colors.textSecondary },
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
  slotRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  slotDay: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  slotTime: { fontSize: 13, color: Colors.textSecondary },
  rvCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm },
  rvHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  rvName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  rvDate: { fontSize: 11, color: Colors.textMuted },
  rvComment: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  bottomCta: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border, ...Shadow.lg },
});
