import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TODAY_APPOINTMENTS } from '@/constants/mock-data';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DATES = [11, 12, 13, 14, 15, 16, 17];

export default function AgendaScreen() {
  const insets = useSafeAreaInsets();
  const [selDay, setSelDay] = useState(1); // Seg = index 1
  const [appointments, setAppointments] = useState(TODAY_APPOINTMENTS);

  const handleAction = (id: string, action: 'confirm' | 'cancel' | 'complete') => {
    Alert.alert(
      action === 'confirm' ? 'Confirmar' : action === 'cancel' ? 'Cancelar' : 'Concluir',
      `Deseja ${action === 'confirm' ? 'confirmar' : action === 'cancel' ? 'cancelar' : 'concluir'} este atendimento?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: () => {
            setAppointments((prev) =>
              prev.map((a) =>
                a.id === id
                  ? { ...a, status: action === 'confirm' ? 'confirmed' : action === 'cancel' ? 'cancelled' : 'completed' }
                  : a
              )
            );
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agenda</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerMonth}>Maio 2025</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Week Calendar */}
      <View style={styles.weekCalendar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekRow}>
          {DAYS.map((day, idx) => {
            const isSelected = idx === selDay;
            const hasAppts = idx === 1 || idx === 3 || idx === 5;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayCell, isSelected && styles.dayCellActive]}
                onPress={() => setSelDay(idx)}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>{day}</Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>{DATES[idx]}</Text>
                {hasAppts && <View style={[styles.dot, isSelected && styles.dotActive]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Summary Bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{appointments.length}</Text>
          <Text style={styles.summaryLabel}>Atendimentos</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{appointments.filter(a => a.status === 'confirmed').length}</Text>
          <Text style={styles.summaryLabel}>Confirmados</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>
            R$ {appointments.reduce((sum, a) => sum + (a.status !== 'cancelled' ? a.price : 0), 0)}
          </Text>
          <Text style={styles.summaryLabel}>Previsto</Text>
        </View>
      </View>

      {/* Appointments List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        <Text style={styles.listTitle}>Horários de hoje</Text>
        {appointments.map((appt) => (
          <View key={appt.id} style={[styles.apptCard, appt.status === 'cancelled' && styles.apptCardCancelled]}>
            {/* Time */}
            <View style={styles.timeCol}>
              <Text style={styles.apptTime}>{appt.time}</Text>
              <View style={[styles.statusLine, {
                backgroundColor: appt.status === 'confirmed' ? Colors.success :
                  appt.status === 'pending' ? Colors.warning :
                  appt.status === 'completed' ? Colors.textMuted : Colors.error
              }]} />
            </View>

            {/* Info */}
            <View style={styles.apptInfo}>
              <View style={styles.apptHeader}>
                <Avatar initials={appt.clientAvatar} size="sm" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.apptClient}>{appt.clientName}</Text>
                  <Text style={styles.apptService}>{appt.service}</Text>
                </View>
                <View style={styles.apptPriceWrap}>
                  <Text style={styles.apptPrice}>R$ {appt.price}</Text>
                  <Badge status={appt.status} />
                </View>
              </View>

              {/* Actions */}
              {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                <View style={styles.actions}>
                  {appt.status === 'pending' && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionConfirm]}
                      onPress={() => handleAction(appt.id, 'confirm')}
                    >
                      <Ionicons name="checkmark" size={14} color={Colors.success} />
                      <Text style={[styles.actionTxt, { color: Colors.success }]}>Confirmar</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionComplete]}
                    onPress={() => handleAction(appt.id, 'complete')}
                  >
                    <Ionicons name="checkmark-done" size={14} color={Colors.primary} />
                    <Text style={[styles.actionTxt, { color: Colors.primary }]}>Concluir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionCancel]}
                    onPress={() => handleAction(appt.id, 'cancel')}
                  >
                    <Ionicons name="close" size={14} color={Colors.error} />
                    <Text style={[styles.actionTxt, { color: Colors.error }]}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
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
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.sm },
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
