import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentsService } from '@/services/appointments.service';
import api from '@/services/api';

const MENU = [
  { icon: 'storefront-outline', label: 'Meu perfil público', sub: 'Como clientes te veem' },
  { icon: 'time-outline', label: 'Horários de trabalho', sub: 'Configurar disponibilidade' },
  { icon: 'location-outline', label: 'Endereço', sub: 'Local de atendimento' },
];

export default function EntrepreneurProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const appointments = await appointmentsService.getAppointments();
      setTotalAppointments(appointments.filter(a => a.status !== 'cancelled').length);
      setCompletedAppointments(appointments.filter(a => a.status === 'completed').length);
      // Busca specialty via /api/services?mine=1 — o profissional logado tem serviços
      const { data } = await api.get('/api/services', { params: { mine: '1' } }).catch(() => ({ data: null }));
      // specialty vem do perfil, por ora exibimos null (o email já está no header)
      setSpecialty(null);
    } catch (err) {
      console.error('Erro ao buscar stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const totalRevenue = 0; // Disponível via dashboard

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient colors={['#1E1E2F', '#2D2D45']} style={styles.header}>
          <View style={styles.circle1} />
          <View style={styles.profileArea}>
            <View style={styles.avatarWrap}>
              <Avatar initials={initials} size="xl" />
            </View>
            <Text style={styles.name}>{user?.name ?? '—'}</Text>
            <Text style={styles.specialty}>{specialty ?? user?.email ?? ''}</Text>
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={styles.verifiedText}>Conta verificada</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          {loading ? (
            <ActivityIndicator color={Colors.primary} style={{ flex: 1 }} />
          ) : (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalAppointments}</Text>
                <Text style={styles.statLabel}>Agendamentos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedAppointments}</Text>
                <Text style={styles.statLabel}>Concluídos</Text>
              </View>
            </>
          )}
        </View>

        {/* Switch to client */}
        <TouchableOpacity style={styles.switchCard} onPress={() => router.replace('../(client)/home')}>
          <Ionicons name="person-outline" size={20} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>Mudar para perfil de cliente</Text>
            <Text style={styles.switchSub}>Agende serviços como cliente</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, idx < MENU.length - 1 && styles.menuItemBorder]}
              activeOpacity={0.7}
              onPress={() => (item as any).route && router.push((item as any).route)}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>NaHora Business v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingBottom: 30, overflow: 'hidden' },
  circle1: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.04)', top: -40, right: -30 },
  profileArea: { alignItems: 'center', paddingTop: Spacing.lg, gap: 4 },
  avatarWrap: { position: 'relative', marginBottom: 4 },
  name: { fontSize: 22, fontWeight: '800', color: '#fff' },
  specialty: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontSize: 12, color: Colors.success, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg, borderRadius: BorderRadius.lg,
    marginTop: -20, padding: Spacing.md, ...Shadow.md,
    minHeight: 64, justifyContent: 'center', alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: Colors.border, marginHorizontal: 8 },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },
  switchCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.infoLight, borderRadius: BorderRadius.lg,
    margin: Spacing.lg, marginBottom: 0, padding: Spacing.md, gap: 12,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  switchTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  switchSub: { fontSize: 12, color: Colors.textSecondary },
  menuCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, margin: Spacing.lg, marginBottom: 0, overflow: 'hidden', ...Shadow.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 12 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.infoLight, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  menuSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, margin: Spacing.lg, marginBottom: 0,
    paddingVertical: 14, borderRadius: BorderRadius.md,
    backgroundColor: Colors.errorLight, borderWidth: 1.5, borderColor: Colors.errorLight,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.error },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginTop: Spacing.lg },
});
