import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';

const MENU_ITEMS = [
  { icon: 'person-outline', label: 'Dados pessoais', sub: 'Nome, email, telefone' },
  { icon: 'notifications-outline', label: 'Notificações', sub: 'Configurar alertas' },
  { icon: 'card-outline', label: 'Pagamentos', sub: 'Métodos e histórico' },
  { icon: 'shield-checkmark-outline', label: 'Privacidade e segurança', sub: 'Senha, dados' },
  { icon: 'help-circle-outline', label: 'Ajuda e suporte', sub: 'FAQ, contato' },
  { icon: 'star-outline', label: 'Avaliar o app', sub: 'Nos ajude a melhorar' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.header}>
          <View style={styles.circle1} />
          <View style={styles.avatarArea}>
            <View style={styles.avatarWrap}>
              <Avatar initials="LM" size="xl" />
              <TouchableOpacity style={styles.editPhoto}>
                <Ionicons name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>Lucas Marques</Text>
            <Text style={styles.email}>lucas@email.com</Text>
            <View style={styles.memberBadge}>
              <Ionicons name="diamond" size={12} color="#F59E0B" />
              <Text style={styles.memberText}>Membro Gold</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatItem value="28" label="Agendamentos" />
          <View style={styles.statDivider} />
          <StatItem value="5" label="Favoritos" />
          <View style={styles.statDivider} />
          <StatItem value="4.8" label="Avaliação média" />
        </View>

        {/* Switch to entrepreneur */}
        <View style={styles.switchCard}>
          <View style={styles.switchLeft}>
            <View style={styles.switchIcon}>
              <Ionicons name="briefcase" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.switchTitle}>Sou empreendedor</Text>
              <Text style={styles.switchSub}>Acessar painel profissional</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => router.replace('/(entrepreneur)/dashboard')}
          >
            <Text style={styles.switchButtonText}>Acessar</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, idx) => (
            <TouchableOpacity key={item.label} style={[styles.menuItem, idx < MENU_ITEMS.length - 1 && styles.menuItemBorder]} activeOpacity={0.7}>
              <View style={styles.menuIconWrap}>
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

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>NaHora v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingBottom: 30, overflow: 'hidden' },
  circle1: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)', top: -40, right: -30 },
  avatarArea: { alignItems: 'center', paddingTop: Spacing.lg },
  avatarWrap: { position: 'relative', marginBottom: Spacing.sm },
  editPhoto: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  name: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 8 },
  memberBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: BorderRadius.full },
  memberText: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.surface, marginHorizontal: Spacing.lg, borderRadius: BorderRadius.lg, marginTop: -20, padding: Spacing.md, ...Shadow.md },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },
  statDivider: { width: 1, height: '100%', backgroundColor: Colors.border },
  switchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, margin: Spacing.lg, marginBottom: 0, padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.infoLight, ...Shadow.sm },
  switchLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  switchIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: Colors.infoLight, alignItems: 'center', justifyContent: 'center' },
  switchTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  switchSub: { fontSize: 12, color: Colors.textSecondary },
  switchButton: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  switchButtonText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  menuCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, margin: Spacing.lg, marginBottom: 0, overflow: 'hidden', ...Shadow.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 12 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIconWrap: { width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.infoLight, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  menuSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: Spacing.lg, marginBottom: 0, paddingVertical: 14, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.errorLight, backgroundColor: Colors.errorLight },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.error },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginTop: Spacing.lg },
});
