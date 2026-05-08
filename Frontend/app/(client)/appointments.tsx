import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MY_APPOINTMENTS, type Appointment } from '@/constants/mock-data';

type Filter = 'all' | 'upcoming' | 'completed' | 'cancelled';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'upcoming', label: 'Próximos' },
  { key: 'completed', label: 'Concluídos' },
  { key: 'cancelled', label: 'Cancelados' },
];

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = MY_APPOINTMENTS.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return a.status === 'confirmed' || a.status === 'pending';
    if (filter === 'completed') return a.status === 'completed';
    if (filter === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Agendamentos</Text>
        <TouchableOpacity style={styles.filterIconBtn}>
          <Ionicons name="options-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersContainer}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterTabText, filter === f.key && styles.filterTabTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="calendar-outline" size={48} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum agendamento</Text>
          <Text style={styles.emptySubtitle}>Você não tem agendamentos nesta categoria.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AppointmentCard appointment={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function AppointmentCard({ appointment: a }: { appointment: Appointment }) {
  const isUpcoming = a.status === 'confirmed' || a.status === 'pending';

  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Avatar initials={a.professionalAvatar} size="md" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{a.professionalName}</Text>
            <Text style={styles.cardService}>{a.service}</Text>
          </View>
        </View>
        <Badge status={a.status} />
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Bottom Row */}
      <View style={styles.cardBottom}>
        <View style={styles.cardMeta}>
          <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.cardMetaTxt}>{a.date}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.cardMetaTxt}>{a.time}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.cardMetaTxt} numberOfLines={1}>{a.location}</Text>
        </View>
        <Text style={styles.cardPrice}>R$ {a.price}</Text>
      </View>

      {/* Actions */}
      {isUpcoming && (
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionCancel}>
            <Text style={styles.actionCancelTxt}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionDetail}>
            <Text style={styles.actionDetailTxt}>Ver detalhes</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  filterIconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', ...Shadow.sm },
  filtersContainer: { flexGrow: 0 },
  filtersRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.sm },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterTabText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterTabTextActive: { color: '#fff' },
  listContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, overflow: 'hidden', ...Shadow.sm },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  cardService: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  cardDivider: { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: Spacing.md },
  cardBottom: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 10, gap: 12, flexWrap: 'wrap' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaTxt: { fontSize: 12, color: Colors.textMuted },
  cardPrice: { marginLeft: 'auto', fontSize: 14, fontWeight: '700', color: Colors.primary },
  cardActions: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.borderLight },
  actionCancel: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRightWidth: 1, borderRightColor: Colors.borderLight },
  actionCancelTxt: { fontSize: 13, fontWeight: '600', color: Colors.error },
  actionDetail: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 4 },
  actionDetailTxt: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  emptyIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
});
