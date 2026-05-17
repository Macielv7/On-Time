import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { appointmentsService, type Appointment, type AppointmentStatus } from '@/services/appointments.service';

type Filter = 'all' | 'upcoming' | 'completed' | 'cancelled';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'upcoming', label: 'Próximos' },
  { key: 'completed', label: 'Concluídos' },
  { key: 'cancelled', label: 'Cancelados' },
];

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  } catch {
    return dateStr;
  }
}

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      const data = await appointmentsService.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = useCallback(async (id: number) => {
    Alert.alert('Cancelar Agendamento', 'Deseja cancelar este agendamento?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await appointmentsService.updateStatus(id, 'cancelled');
            fetchAppointments();
          } catch (err: any) {
            Alert.alert('Erro', err.message);
          }
        },
      },
    ]);
  }, [fetchAppointments]);

  const filtered = appointments.filter((a) => {
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
        <TouchableOpacity style={styles.filterIconBtn} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow} style={styles.filtersContainer}>
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
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando agendamentos...</Text>
        </View>
      ) : filtered.length === 0 ? (
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
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <AppointmentCard appointment={item} onCancel={() => handleCancel(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        />
      )}
    </View>
  );
}

function AppointmentCard({ appointment: a, onCancel }: { appointment: Appointment; onCancel: () => void }) {
  const isUpcoming = a.status === 'confirmed' || a.status === 'pending';
  const initials = (a.professional_name || 'P')
    .split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Avatar initials={initials} size="md" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{a.professional_name ?? '—'}</Text>
            <Text style={styles.cardService}>{a.service_name ?? '—'}</Text>
          </View>
        </View>
        <Badge status={a.status} />
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBottom}>
        <View style={styles.cardMeta}>
          <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.cardMetaTxt}>{formatDate(a.scheduled_date)}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.cardMetaTxt}>{a.scheduled_time}</Text>
        </View>
        <Text style={styles.cardPrice}>R$ {a.total_price.toFixed(2)}</Text>
      </View>

      {isUpcoming && (
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionCancel} onPress={onCancel}>
            <Text style={styles.actionCancelTxt}>Cancelar</Text>
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
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: Colors.textSecondary },
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
  actionCancel: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  actionCancelTxt: { fontSize: 13, fontWeight: '600', color: Colors.error },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  emptyIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
});
