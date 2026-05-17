import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { GradientButton } from '@/components/ui/gradient-button';
import { Avatar } from '@/components/ui/avatar';
import { professionalsService, type Professional, type ServiceItem } from '@/services/professionals.service';
import { appointmentsService } from '@/services/appointments.service';

const PAYMENT_METHODS = [
  { id: 'mercado_pago', icon: 'card', label: 'Mercado Pago', sub: 'Pix, cartão, boleto' },
  { id: 'credit_card', icon: 'card-outline', label: 'Cartão de Crédito', sub: 'Visa, Master, Elo' },
  { id: 'cash', icon: 'cash-outline', label: 'Dinheiro', sub: 'Pagamento presencial' },
];

function getNextDays(n: number) {
  const days: { day: string; date: string; full: string }[] = [];
  const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push({ day: labels[d.getDay()], date: dd, full: `${y}-${m}-${dd}` });
  }
  return days;
}

function generateSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h <= 17; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 17) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

const DAYS = getNextDays(7);
const SLOTS = generateSlots();

export default function BookingScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ professionalId?: string; serviceId?: string }>();

  const [professional, setProfessional] = useState<Professional | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [selDay, setSelDay] = useState(DAYS[0].full);
  const [selSlot, setSelSlot] = useState<string | null>(null);
  const [selPayment, setSelPayment] = useState('mercado_pago');

  useEffect(() => {
    async function load() {
      if (!params.professionalId) { setLoading(false); return; }
      try {
        const pro = await professionalsService.getProfessional(Number(params.professionalId));
        setProfessional(pro);
        const svc = params.serviceId
          ? pro.services?.find((s) => s.id === Number(params.serviceId)) ?? pro.services?.[0] ?? null
          : pro.services?.[0] ?? null;
        setSelectedService(svc);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.professionalId, params.serviceId]);

  const handleConfirm = useCallback(async () => {
    if (!selSlot) { Alert.alert('Atenção', 'Selecione um horário.'); return; }
    if (!professional || !selectedService) { Alert.alert('Erro', 'Dados incompletos.'); return; }

    setConfirming(true);
    try {
      await appointmentsService.createAppointment({
        professional_id: professional.id,
        service_id: selectedService.id,
        scheduled_date: selDay,
        scheduled_time: selSlot,
        payment_method: selPayment,
      });
      setConfirmed(true);
    } catch (err: any) {
      Alert.alert('Erro ao agendar', err.message);
    } finally {
      setConfirming(false);
    }
  }, [selSlot, professional, selectedService, selDay, selPayment]);

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 12, color: Colors.textSecondary, fontSize: 14 }}>Carregando...</Text>
      </View>
    );
  }

  // Sem profissional — veio sem params
  if (!professional) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', padding: 32 }]}>
        <Ionicons name="alert-circle-outline" size={56} color={Colors.textMuted} />
        <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 16, textAlign: 'center' }}>
          Profissional não selecionado
        </Text>
        <Text style={{ fontSize: 14, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' }}>
          Escolha um profissional na tela inicial para agendar.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('../(client)/home')}
          style={{ marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.primary }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Ir para o início</Text>
        </TouchableOpacity>
      </View>
    );
  }


  if (confirmed) {
    const selDayObj = DAYS.find((d) => d.full === selDay);
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
              <Ionicons name="person" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.successLabel}>{professional?.name}</Text>
            </View>
            <View style={styles.successRow}>
              <Ionicons name="cut" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.successLabel}>{selectedService?.name}</Text>
            </View>
            <View style={styles.successRow}>
              <Ionicons name="calendar" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.successLabel}>{selDayObj?.day}, {selDayObj?.date} • {selSlot}</Text>
            </View>
            <View style={styles.successRow}>
              <Ionicons name="cash" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.successLabel}>R$ {selectedService?.price?.toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.successButton} onPress={() => router.replace('../(client)/appointments')}>
            <Text style={styles.successButtonText}>Ver meus agendamentos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('../(client)/home')} style={{ marginTop: 12 }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Voltar ao início</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  const proInitials = professional?.name
    ? professional.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <View style={styles.container}>
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
          <Avatar initials={proInitials} size="md" />
          <View style={{ flex: 1 }}>
            <Text style={styles.svcName}>{selectedService?.name ?? '—'}</Text>
            <Text style={styles.svcPro}>{professional?.name ?? '—'}</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
              {selectedService?.duration_min && (
                <View style={styles.svcMeta}>
                  <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                  <Text style={styles.svcMetaTxt}>{selectedService.duration_min} min</Text>
                </View>
              )}
              {selectedService?.price && (
                <View style={styles.svcMeta}>
                  <Ionicons name="cash-outline" size={12} color={Colors.primary} />
                  <Text style={[styles.svcMetaTxt, { color: Colors.primary, fontWeight: '700' }]}>
                    R$ {selectedService.price}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Services selector (if multiple) */}
        {professional?.services && professional.services.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.secTitle}>Serviço</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {professional.services.map((svc) => (
                <TouchableOpacity
                  key={svc.id}
                  style={[styles.svcChip, selectedService?.id === svc.id && styles.svcChipActive]}
                  onPress={() => setSelectedService(svc)}
                >
                  <Text style={[styles.svcChipName, selectedService?.id === svc.id && styles.svcChipNameActive]}>
                    {svc.name}
                  </Text>
                  <Text style={[styles.svcChipPrice, selectedService?.id === svc.id && { color: '#fff' }]}>
                    R$ {svc.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
            <SummaryRow label="Serviço" value={selectedService?.name ?? '—'} />
            <SummaryRow label="Profissional" value={professional?.name ?? '—'} />
            <SummaryRow label="Data" value={DAYS.find((d) => d.full === selDay)?.day + ', ' + DAYS.find((d) => d.full === selDay)?.date} />
            <SummaryRow label="Horário" value={selSlot || '—'} />
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Total</Text>
              <Text style={styles.summaryTotalValue}>R$ {selectedService?.price?.toFixed(2) ?? '—'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomCta, { paddingBottom: insets.bottom + 16 }]}>
        {confirming ? (
          <View style={styles.loadingBtn}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.loadingBtnText}>Confirmando...</Text>
          </View>
        ) : (
          <GradientButton title="Confirmar Agendamento" onPress={handleConfirm} />
        )}
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value ?? '—'}</Text>
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
  svcChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: BorderRadius.md, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, gap: 4, ...Shadow.sm },
  svcChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  svcChipName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  svcChipNameActive: { color: '#fff' },
  svcChipPrice: { fontSize: 12, color: Colors.textMuted, fontWeight: '700' },
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
  loadingBtn: { height: 52, borderRadius: BorderRadius.md, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  loadingBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
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
