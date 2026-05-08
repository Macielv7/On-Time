import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { ENTREPRENEUR_STATS } from '@/constants/mock-data';

const MENU = [
  { icon: 'storefront-outline', label: 'Meu perfil público', sub: 'Como clientes te veem' },
  { icon: 'time-outline', label: 'Horários de trabalho', sub: 'Configurar disponibilidade' },
  { icon: 'location-outline', label: 'Endereço', sub: 'Local de atendimento' },
  { icon: 'card-outline', label: 'Dados bancários', sub: 'Para receber pagamentos' },
  { icon: 'notifications-outline', label: 'Notificações', sub: 'Alertas e lembretes' },
  { icon: 'shield-checkmark-outline', label: 'Segurança', sub: 'Senha e privacidade' },
  { icon: 'help-circle-outline', label: 'Suporte', sub: 'Central de ajuda' },
];

export default function EntrepreneurProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient colors={['#1E1E2F', '#2D2D45']} style={styles.header}>
          <View style={styles.circle1} />
          <View style={styles.profileArea}>
            <View style={styles.avatarWrap}>
              <Avatar initials="CM" size="xl" />
              <TouchableOpacity style={styles.editPhoto}>
                <Ionicons name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>Carlos Mendes</Text>
            <Text style={styles.specialty}>Barbeiro Profissional</Text>
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={styles.verifiedText}>Perfil verificado</Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>4.9 • 312 avaliações</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Clientes', value: '283' },
            { label: 'Este mês', value: `R$${(ENTREPRENEUR_STATS.monthRevenue / 1000).toFixed(1)}k` },
            { label: 'Agendamentos', value: `${ENTREPRENEUR_STATS.weekAppointments}` },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Status Toggle */}
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={styles.statusDot} />
            <View>
              <Text style={styles.statusTitle}>Aceitando agendamentos</Text>
              <Text style={styles.statusSub}>Clientes podem te agendar agora</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.statusToggle}>
            <View style={styles.statusToggleInner} />
          </TouchableOpacity>
        </View>

        {/* Switch to client */}
        <TouchableOpacity style={styles.switchCard} onPress={() => router.replace('/(client)/home')}>
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
            <TouchableOpacity key={item.label} style={[styles.menuItem, idx < MENU.length - 1 && styles.menuItemBorder]} activeOpacity={0.7}>
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

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/(auth)/login')}>
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
  editPhoto: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#1E1E2F' },
  name: { fontSize: 22, fontWeight: '800', color: '#fff' },
  specialty: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontSize: 12, color: Colors.success, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.surface, marginHorizontal: Spacing.lg, borderRadius: BorderRadius.lg, marginTop: -20, padding: Spacing.md, ...Shadow.md },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.border },
  statusCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, margin: Spacing.lg, marginBottom: 0, padding: Spacing.md, gap: 12, ...Shadow.sm },
  statusLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  statusTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  statusSub: { fontSize: 12, color: Colors.textSecondary },
  statusToggle: { width: 48, height: 28, borderRadius: 14, backgroundColor: Colors.success, padding: 2, justifyContent: 'center' },
  statusToggleInner: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', alignSelf: 'flex-end' },
  switchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.infoLight, borderRadius: BorderRadius.lg, margin: Spacing.lg, marginBottom: 0, padding: Spacing.md, gap: 12, borderWidth: 1, borderColor: Colors.primary + '30' },
  switchTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  switchSub: { fontSize: 12, color: Colors.textSecondary },
  menuCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, margin: Spacing.lg, marginBottom: 0, overflow: 'hidden', ...Shadow.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 12 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.infoLight, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  menuSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: Spacing.lg, marginBottom: 0, paddingVertical: 14, borderRadius: BorderRadius.md, backgroundColor: Colors.errorLight, borderWidth: 1.5, borderColor: Colors.errorLight },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.error },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginTop: Spacing.lg },
});
