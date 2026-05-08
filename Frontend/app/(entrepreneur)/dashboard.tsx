import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ENTREPRENEUR_STATS, TODAY_APPOINTMENTS } from '@/constants/mock-data';

const { width } = Dimensions.get('window');
const BAR_MAX_HEIGHT = 80;

function BarChart() {
  const data = ENTREPRENEUR_STATS.chartData;
  const max = Math.max(...data);
  return (
    <View style={chart.container}>
      {data.map((val, i) => {
        const barHeight = (val / max) * BAR_MAX_HEIGHT;
        const isMax = val === max;
        return (
          <View key={i} style={chart.barCol}>
            <Text style={chart.barVal}>R${val}</Text>
            <View style={[chart.barBg, { height: BAR_MAX_HEIGHT }]}>
              <LinearGradient
                colors={isMax ? ['#6C63FF', '#8B5CF6'] : ['#A78BFA', '#C4B5FD']}
                style={[chart.bar, { height: barHeight }]}
              />
            </View>
            <Text style={chart.barLabel}>{ENTREPRENEUR_STATS.chartLabels[i]}</Text>
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <LinearGradient colors={['#1E1E2F', '#2D2D45']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Bom dia, Carlos 👋</Text>
              <Text style={styles.subGreeting}>Aqui está seu resumo de hoje</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
                <Ionicons name="notifications-outline" size={22} color="#fff" />
                <View style={styles.notifDot} />
              </TouchableOpacity>
              <Avatar initials="CM" size="sm" />
            </View>
          </View>

          {/* Revenue Chart Card */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Faturamento da semana</Text>
                <Text style={styles.chartValue}>R$ {ENTREPRENEUR_STATS.weekRevenue.toLocaleString('pt-BR')}</Text>
                <View style={styles.chartGrowth}>
                  <Ionicons name="trending-up" size={12} color="#2DD4BF" />
                  <Text style={styles.chartGrowthText}>+18% vs semana anterior</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.chartPeriod}>
                <Text style={styles.chartPeriodText}>Semana</Text>
                <Ionicons name="chevron-down" size={12} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>
            <BarChart />
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <MetricCard
            icon="people"
            label="Clientes Atendidos"
            value={`${ENTREPRENEUR_STATS.weekClients}`}
            sub="esta semana"
            color="#6C63FF"
            light="#EDE9FF"
          />
          <MetricCard
            icon="calendar"
            label="Agendamentos"
            value={`${ENTREPRENEUR_STATS.weekAppointments}`}
            sub="esta semana"
            color="#10B981"
            light="#CCFBF1"
          />
          <MetricCard
            icon="cash"
            label="Receita Mensal"
            value={`R$${(ENTREPRENEUR_STATS.monthRevenue / 1000).toFixed(1)}k`}
            sub="este mês"
            color="#F59E0B"
            light="#FEF3C7"
          />
          <MetricCard
            icon="star"
            label="Avaliação Média"
            value="4.9"
            sub="312 avaliações"
            color="#EC4899"
            light="#FCE7F3"
          />
        </View>

        {/* Today's Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agenda de Hoje</Text>
            <TouchableOpacity onPress={() => router.push('/(entrepreneur)/agenda' as any)}>
              <Text style={styles.seeAll}>Ver completo</Text>
            </TouchableOpacity>
          </View>

          {TODAY_APPOINTMENTS.slice(0, 4).map((appt) => (
            <View key={appt.id} style={styles.apptCard}>
              <View style={styles.timeLine}>
                <Text style={styles.apptTime}>{appt.time}</Text>
                <View style={[styles.timeDot, { backgroundColor: appt.status === 'confirmed' ? Colors.success : Colors.warning }]} />
              </View>
              <View style={styles.apptContent}>
                <Avatar initials={appt.clientAvatar} size="sm" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.apptClient}>{appt.clientName}</Text>
                  <Text style={styles.apptService}>{appt.service}</Text>
                </View>
                <View style={styles.apptRight}>
                  <Text style={styles.apptPrice}>R$ {appt.price}</Text>
                  <Badge status={appt.status} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickGrid}>
            {[
              { icon: 'add-circle', label: 'Novo Serviço', color: '#6C63FF', route: '/(entrepreneur)/services' },
              { icon: 'share-social', label: 'Compartilhar', color: '#10B981', route: null },
              { icon: 'stats-chart', label: 'Relatório', color: '#F59E0B', route: null },
              { icon: 'settings', label: 'Configurações', color: '#EC4899', route: null },
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
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error, borderWidth: 1.5, borderColor: '#1E1E2F' },
  chartCard: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  chartTitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  chartValue: { fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 4 },
  chartGrowth: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  chartGrowthText: { fontSize: 11, color: '#2DD4BF', fontWeight: '600' },
  chartPeriod: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full },
  chartPeriodText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
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
