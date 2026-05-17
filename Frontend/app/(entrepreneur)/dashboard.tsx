import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentsService, type Appointment } from '@/services/appointments.service';

const { width } = Dimensions.get('window');
const BAR_MAX_HEIGHT = 80;

function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data, 1);
  return (
    <View style={chart.container}>
      {data.map((val, i) => {
        const barHeight = (val / max) * BAR_MAX_HEIGHT;
        const isMax = val === max;
        return (
          <View key={i} style={chart.barCol}>
            <Text style={chart.barVal}>{val > 0 ? `R$${val}` : ''}</Text>
            <View style={[chart.barBg, { height: BAR_MAX_HEIGHT }]}>
              <LinearGradient
                colors={isMax ? ['#6C63FF', '#8B5CF6'] : ['#A78BFA', '#C4B5FD']}
                style={[chart.bar, { height: Math.max(barHeight, 4) }]}
              />
            </View>
            <Text style={chart.barLabel}>{labels[i]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const chart = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 4 },
  barCol: { alignItems: 'center', gap: 4, flex: 1 },
  barBg: { width: '70%', justifyContent: 'flex-end', borderRadius: 6 },
  bar: { width: '100%', borderRadius: 6 },
  barVal: { fontSize: 8, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  barLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
});

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
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

  // Calcular stats a partir dos agendamentos reais
  const weekRevenue = appointments
    .filter((a) => a.status === 'completed')
    .reduce((sum, a) => sum + a.total_price, 0);

  const weekClients = new Set(
    appointments.filter((a) => a.status !== 'cancelled').map((a) => a.client_id)
  ).size;

  const weekAppointments = appointments.filter((a) => a.status !== 'cancelled').length;

  // Gráfico: revenue dos últimos 7 dias (simplificado por dia da semana)
  const chartLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const chartData = Array(7).fill(0);
  appointments.filter((a) => a.status === 'completed').forEach((a) => {
    const dayOfWeek = new Date(a.scheduled_date + 'T00:00:00').getDay();
    const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    chartData[idx] += a.total_price;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments
    .filter((a) => a.scheduled_date === todayStr && a.status !== 'cancelled')
    .slice(0, 5);

  const firstName = user?.name?.split(' ')[0] ?? 'você';
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <LinearGradient colors={['#1E1E2F', '#2D2D45']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Olá, {firstName} 👋</Text>
              <Text style={styles.subGreeting}>Aqui está seu resumo de hoje</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('../notifications')}>
                <Ionicons name="notifications-outline" size={22} color="#fff" />
              </TouchableOpacity>
              <Avatar initials={initials} size="sm" />
            </View>
          </View>

          {/* Revenue Chart Card */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Faturamento (concluídos)</Text>
                <Text style={styles.chartValue}>
                  R$ {weekRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
            {loading ? (
              <ActivityIndicator color="rgba(255,255,255,0.5)" />
            ) : (
              <BarChart data={chartData} labels={chartLabels} />
            )}
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <MetricCard icon="people" label="Clientes" value={`${weekClients}`} sub="total" color="#6C63FF" light="#EDE9FF" />
          <MetricCard icon="calendar" label="Agendamentos" value={`${weekAppointments}`} sub="total" color="#10B981" light="#CCFBF1" />
          <MetricCard icon="cash" label="Faturamento" value={`R$${(weekRevenue / 1000).toFixed(1)}k`} sub="concluídos" color="#F59E0B" light="#FEF3C7" />
          <MetricCard icon="checkmark-circle" label="Concluídos" value={`${appointments.filter(a => a.status === 'completed').length}`} sub="atendimentos" color="#EC4899" light="#FCE7F3" />
        </View>

        {/* Today's Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agenda de Hoje</Text>
            <TouchableOpacity onPress={() => router.push('/(entrepreneur)/agenda' as any)}>
              <Text style={styles.seeAll}>Ver completo</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
          ) : todayAppointments.length === 0 ? (
            <View style={styles.emptyDay}>
              <Ionicons name="calendar-outline" size={32} color={Colors.textMuted} />
              <Text style={styles.emptyDayText}>Nenhum agendamento hoje</Text>
            </View>
          ) : (
            todayAppointments.map((appt) => {
              const clientInitials = (appt.client_name || 'C')
                .split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
              return (
                <View key={appt.id} style={styles.apptCard}>
                  <View style={styles.timeLine}>
                    <Text style={styles.apptTime}>{appt.scheduled_time}</Text>
                    <View style={[styles.timeDot, { backgroundColor: appt.status === 'confirmed' ? Colors.success : Colors.warning }]} />
                  </View>
                  <View style={styles.apptContent}>
                    <Avatar initials={clientInitials} size="sm" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.apptClient}>{appt.client_name ?? '—'}</Text>
                      <Text style={styles.apptService}>{appt.service_name ?? '—'}</Text>
                    </View>
                    <View style={styles.apptRight}>
                      <Text style={styles.apptPrice}>R$ {appt.total_price}</Text>
                      <Badge status={appt.status} />
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickGrid}>
            {[
              { icon: 'add-circle', label: 'Novo Serviço', color: '#6C63FF', route: '/(entrepreneur)/services' },
              { icon: 'calendar', label: 'Agenda', color: '#10B981', route: '/(entrepreneur)/agenda' },
              { icon: 'notifications', label: 'Notificações', color: '#F59E0B', route: '/notifications' },
              { icon: 'person', label: 'Perfil', color: '#EC4899', route: '/(entrepreneur)/profile' },
            ].map((qa) => (
              <TouchableOpacity
                key={qa.label}
                style={styles.quickCard}
                onPress={() => qa.route && router.push(qa.route as any)}
              >
                <View style={[styles.quickIcon, { backgroundColor: qa.color + '22' }]}>
                  <Ionicons name={qa.icon as any} size={24} color={qa.color} />
                </View>
                <Text style={styles.quickLabel}>{qa.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function MetricCard({ icon, label, value, sub, color, light }: any) {
  return (
    <View style={[styles.metricCard, { borderLeftColor: color, borderLeftWidth: 3 }]}>
      <View style={[styles.metricIcon, { backgroundColor: light }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricSub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.md, marginBottom: Spacing.lg },
  greeting: { fontSize: 20, fontWeight: '800', color: '#fff' },
  subGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  notifBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  chartCard: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  chartTitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  chartValue: { fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, padding: Spacing.lg },
  metricCard: { width: (width - Spacing.lg * 2 - Spacing.sm) / 2, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, gap: 4, ...Shadow.sm },
  metricIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  metricValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  metricLabel: { fontSize: 11, fontWeight: '600', color: Colors.textPrimary },
  metricSub: { fontSize: 10, color: Colors.textMuted },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  emptyDay: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyDayText: { fontSize: 14, color: Colors.textSecondary },
  apptCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  timeLine: { alignItems: 'center', gap: 4, width: 44 },
  apptTime: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary },
  timeDot: { width: 8, height: 8, borderRadius: 4 },
  apptContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.sm, ...Shadow.sm },
  apptClient: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  apptService: { fontSize: 11, color: Colors.textSecondary },
  apptRight: { alignItems: 'flex-end', gap: 4 },
  apptPrice: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  quickGrid: { flexDirection: 'row', gap: Spacing.sm },
  quickCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.sm, alignItems: 'center', gap: 6, ...Shadow.sm },
  quickIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
});
