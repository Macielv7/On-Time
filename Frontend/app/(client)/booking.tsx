import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { GradientButton } from '@/components/ui/gradient-button';
import { Avatar } from '@/components/ui/avatar';

const DAYS = [
  { day: 'Dom', date: '11', full: '2025-05-11' },
  { day: 'Seg', date: '12', full: '2025-05-12' },
  { day: 'Ter', date: '13', full: '2025-05-13' },
  { day: 'Qua', date: '14', full: '2025-05-14' },
  { day: 'Qui', date: '15', full: '2025-05-15' },
  { day: 'Sex', date: '16', full: '2025-05-16' },
  { day: 'Sáb', date: '17', full: '2025-05-17' },
];

const SLOTS = ['09:00','09:45','10:30','11:15','14:00','14:45','15:30','16:15','17:00'];

const PAYMENT_METHODS = [
  { id: 'mp', icon: 'card', label: 'Mercado Pago', sub: 'Pix, cartão, boleto' },
  { id: 'credit', icon: 'card-outline', label: 'Cartão de Crédito', sub: 'Visa, Master, Elo' },
  { id: 'cash', icon: 'cash-outline', label: 'Dinheiro', sub: 'Pagamento presencial' },
];

export default function BookingScreen() {
  const insets = useSafeAreaInsets();
  const [selDay, setSelDay] = useState('2025-05-12');
  const [selSlot, setSelSlot] = useState<string | null>(null);
  const [selPayment, setSelPayment] = useState('mp');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selSlot) {
      Alert.alert('Atenção', 'Por favor, selecione um horário.');
      return;
    }
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <View style={[styles.successContainer, { paddingTop: insets.top }]}>
        <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.successGradient}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Agendado com Sucesso!</Text>
          <Text style={styles.successSubtitle}>Seu agendamento foi confirmado.</Text>
          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Ionicons name="person" size={16} color={Colors.textMuted} />
              <Text style={styles.successLabel}>Carlos Mendes</Text>
            </View>
            <View style={styles.successRow}>
              <Ionicons name="cut" size={16} color={Colors.textMuted} />
              <Text style={styles.successLabel}>Corte + Barba</Text>
            </View>
            <View style={styles.successRow}>
              <Ionicons name="calendar" size={16} color={Colors.textMuted} />
              <Text style={styles.successLabel}>Seg, 12 Mai • {selSlot}</Text>
            </View>
            <View style={styles.successRow}>
              <Ionicons name="cash" size={16} color={Colors.textMuted} />
              <Text style={styles.successLabel}>R$ 55,00</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.successButton}
            onPress={() => router.replace('/(client)/appointments')}
          >
            <Text style={styles.successButtonText}>Ver meus agendamentos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/(client)/home')} style={{ marginTop: 12 }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Voltar ao início</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Serviço</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Service Summary */}
        <View style={styles.serviceCard}>
          <Avatar initials="CM" size="md" />
          <View style={{ flex: 1 }}>
            <Text style={styles.svcName}>Corte + Barba</Text>
            <Text style={styles.svcPro}>Carlos Mendes</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
              <View style={styles.svcMeta}>
                <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.svcMetaTxt}>60 min</Text>
              </View>
              <View style={styles.svcMeta}>
                <Ionicons name="cash-outline" size={12} color={Colors.primary} />
                <Text style={[styles.svcMetaTxt, { color: Colors.primary, fontWeight: '700' }]}>R$ 55</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Date Picker */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>Escolha a data</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {DAYS.map((d) => (
              <TouchableOpacity
                key={d.full}
                style={[styles.dayChip, selDay === d.full && styles.dayChipActive]}
                onPress={() => setSelDay(d.full)}
              >
                <Text style={[styles.dayLabel, selDay === d.full && styles.dayLabelActive]}>{d.day}</Text>
                <Text style={[styles.dayDate, selDay === d.full && styles.dayDateActive]}>{d.date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>Escolha o horário</Text>
          <View style={styles.slotsGrid}>
            {SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.slotChip, selSlot === slot && styles.slotChipActive]}
                onPress={() => setSelSlot(slot)}
              >
                <Text style={[styles.slotTxt, selSlot === slot && styles.slotTxtActive]}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>Forma de pagamento</Text>
          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity
              key={pm.id}
              style={[styles.payCard, selPayment === pm.id && styles.payCardActive]}
              onPress={() => setSelPayment(pm.id)}
            >
              <View style={[styles.payIconWrap, selPayment === pm.id && { backgroundColor: Colors.infoLight }]}>
                <Ionicons name={pm.icon as any} size={20} color={selPayment === pm.id ? Colors.primary : Colors.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.payLabel}>{pm.label}</Text>
                <Text style={styles.paySub}>{pm.sub}</Text>
              </View>
              <View style={[styles.radio, selPayment === pm.id && styles.radioActive]}>
                {selPayment === pm.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>Resumo</Text>
          <View style={styles.summaryCard}>
            <SummaryRow label="Serviço" value="Corte + Barba" />
            <SummaryRow label="Profissional" value="Carlos Mendes" />
            <SummaryRow label="Data" value="Seg, 12 Mai" />
            <SummaryRow label="Horário" value={selSlot || '—'} />
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Total</Text>
              <Text style={styles.summaryTotalValue}>R$ 55,00</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomCta, { paddingBottom: insets.bottom + 16 }]}>
        <GradientButton title="Confirmar Agendamento" onPress={handleConfirm} />
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: Colors.surface, ...Shadow.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  serviceCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, margin: Spacing.lg, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadow.sm },
  svcName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  svcPro: { fontSize: 13, color: Colors.textSecondary },
  svcMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  svcMetaTxt: { fontSize: 12, color: Colors.textMuted },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  secTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  dayChip: { width: 54, height: 70, borderRadius: BorderRadius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1.5, borderColor: Colors.border, ...Shadow.sm },
  dayChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted },
  dayLabelActive: { color: 'rgba(255,255,255,0.8)' },
  dayDate: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  dayDateActive: { color: '#fff' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  slotChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: BorderRadius.md, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, ...Shadow.sm },
  slotChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  slotTxt: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  slotTxtActive: { color: '#fff' },
  payCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: 'transparent', ...Shadow.sm },
  payCardActive: { borderColor: Colors.primary },
  payIconWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  payLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  paySub: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  summaryCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadow.sm, gap: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: Colors.textSecondary },
  summaryValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  summaryTotal: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  bottomCta: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border, ...Shadow.lg },
  successContainer: { flex: 1 },
  successGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  successIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 8, textAlign: 'center' },
  successSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: Spacing.xl, textAlign: 'center' },
  successCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.lg, padding: Spacing.lg, gap: 12, width: '100%', marginBottom: Spacing.xl },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  successLabel: { fontSize: 14, color: '#fff', fontWeight: '500' },
  successButton: { backgroundColor: '#fff', paddingHorizontal: 32, paddingVertical: 14, borderRadius: BorderRadius.full },
  successButtonText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
});
