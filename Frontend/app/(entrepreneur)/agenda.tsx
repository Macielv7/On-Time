import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { appointmentsService, type Appointment, type AppointmentStatus } from '@/services/appointments.service';

function getDayLabel(dateStr: string): string {
  const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const d = new Date(dateStr + 'T00:00:00');
  return labels[d.getDay()];
}

function getNextDays(n: number) {
  const days: { label: string; num: number; full: string }[] = [];
  const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push({ label: labels[d.getDay()], num: d.getDate(), full: `${y}-${m}-${dd}` });
  }
  return days;
}

const DAYS = getNextDays(7);

export default function AgendaScreen() {
  const insets = useSafeAreaInsets();
  const [selDay, setSelDay] = useState(DAYS[0].full);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
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

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchData(); }, [fetchData]);

  const dayAppointments = appointments.filter((a) => a.scheduled_date === selDay);

  const handleAction = useCallback(async (id: number, action: 'confirmed' | 'cancelled' | 'completed') => {
    const labels = { confirmed: 'Confirmar', cancelled: 'Cancelar', completed: 'Concluir' };
    Alert.alert(labels[action], `Deseja ${labels[action].toLowerCase()} este atendimento?`, [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            await appointmentsService.updateStatus(id, action);
            fetchData();
          } catch (err: any) {
            Alert.alert('Erro', err.message);
          }
        },
      },
    ]);
  }, [fetchData]);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agenda</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerMonth}>{currentMonth}</Text>
        </View>
      </View>

      {/* Week Calendar */}
      <View style={styles.weekCalendar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekRow}>
          {DAYS.map((day) => {
            const isSelected = day.full === selDay;
            const hasAppts = appointments.some((a) => a.scheduled_date === day.full);
            return (
              <TouchableOpacity
                key={day.full}
                style={[styles.dayCell, isSelected && styles.dayCellActive]}
                onPress={() => setSelDay(day.full)}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>{day.label}</Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>{day.num}</Text>
                {hasAppts && <View style={[styles.dot, isSelected && styles.dotActive]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Summary Bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{dayAppointments.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{dayAppointments.filter((a) => a.status === 'confirmed').length}</Text>
          <Text style={styles.summaryLabel}>Confirmados</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>
            R$ {dayAppointments.filter((a) => a.status !== 'cancelled').reduce((s, a) => s + a.total_price, 0).toFixed(0)}
          </Text>
          <Text style={styles.summaryLabel}>Previsto</Text>
        </View>
      </View>

      {/* Appointments List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        <Text style={styles.listTitle}>
          {selDay === todayStr ? 'Horários de hoje' : `Horários de ${getDayLabel(selDay)}, ${selDay.split('-')[2]}/${selDay.split('-')[1]}`}
        </Text>

        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />
        ) : dayAppointments.length === 0 ? (
          <View style={styles.emptyDay}>
            <Ionicons name="calendar-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum agendamento neste dia</Text>
          </View>
        ) : (
          dayAppointments.map((appt) => {
            const clientInitials = (appt.client_name || 'C')
              .split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
            return (
              <View key={appt.id} style={[styles.apptCard, appt.status === 'cancelled' && styles.apptCardCancelled]}>
                <View style={styles.timeCol}>
                  <Text style={styles.apptTime}>{appt.scheduled_time}</Text>
                  <View style={[styles.statusLine, {
                    backgroundColor: appt.status === 'confirmed' ? Colors.success
                      : appt.status === 'pending' ? Colors.warning
                      : appt.status === 'completed' ? Colors.textMuted : Colors.error,
                  }]} />
                </View>
                <View style={styles.apptInfo}>
                  <View style={styles.apptHeader}>
                    <Avatar initials={clientInitials} size="sm" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.apptClient}>{appt.client_name ?? '—'}</Text>
                      <Text style={styles.apptService}>{appt.service_name ?? '—'}</Text>
                    </View>
                    <View style={styles.apptPriceWrap}>
                      <Text style={styles.apptPrice}>R$ {appt.total_price}</Text>
                      <Badge status={appt.status} />
                    </View>
                  </View>

                  {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                    <View style={styles.actions}>
                      {appt.status === 'pending' && (
                        <TouchableOpacity style={[styles.actionBtn, styles.actionConfirm]} onPress={() => handleAction(appt.id, 'confirmed')}>
                          <Ionicons name="checkmark" size={14} color={Colors.success} />
                          <Text style={[styles.actionTxt, { color: Colors.success }]}>Confirmar</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={[styles.actionBtn, styles.actionComplete]} onPress={() => handleAction(appt.id, 'completed')}>
                        <Ionicons name="checkmark-done" size={14} color={Colors.primary} />
                        <Text style={[styles.actionTxt, { color: Colors.primary }]}>Concluir</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, styles.actionCancel]} onPress={() => handleAction(appt.id, 'cancelled')}>
                        <Ionicons name="close" size={14} color={Colors.error} />
                        <Text style={[styles.actionTxt, { color: Colors.error }]}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerMonth: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  weekCalendar: { backgroundColor: Colors.surface, marginHorizontal: Spacing.lg, borderRadius: BorderRadius.lg, ...Shadow.sm },
  weekRow: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, gap: 4 },
  dayCell: { width: 44, height: 70, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', gap: 4 },
  dayCellActive: { backgroundColor: Colors.primary },
  dayName: { fontSize: 10, fontWeight: '600', color: Colors.textMuted },
  dayNameActive: { color: 'rgba(255,255,255,0.8)' },
  dayNum: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  dayNumActive: { color: '#fff' },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.primary },
  dotActive: { backgroundColor: '#fff' },
  summaryBar: { flexDirection: 'row', backgroundColor: Colors.surface, marginHorizontal: Spacing.lg, marginTop: Spacing.sm, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadow.sm },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryVal: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  summaryLabel: { fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: Colors.border, marginHorizontal: 4 },
  listContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: 30 },
  listTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptyDay: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
  apptCard: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  apptCardCancelled: { opacity: 0.5 },
  timeCol: { alignItems: 'center', gap: 4, paddingTop: 4, width: 48 },
  apptTime: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  statusLine: { width: 2, flex: 1, borderRadius: 1, minHeight: 40 },
  apptInfo: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadow.sm },
  apptHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  apptClient: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  apptService: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  apptPriceWrap: { alignItems: 'flex-end', gap: 4 },
  apptPrice: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  actions: { flexDirection: 'row', gap: 6, marginTop: Spacing.sm },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 7, borderRadius: BorderRadius.sm, gap: 4 },
  actionConfirm: { backgroundColor: Colors.successLight },
  actionComplete: { backgroundColor: Colors.infoLight },
  actionCancel: { backgroundColor: Colors.errorLight },
  actionTxt: { fontSize: 11, fontWeight: '700' },
});
