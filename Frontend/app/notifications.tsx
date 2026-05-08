import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { NOTIFICATIONS, type Notification } from '@/constants/mock-data';

const TYPE_CONFIG: Record<Notification['type'], { icon: string; color: string; bg: string }> = {
  confirmation: { icon: 'checkmark-circle', color: Colors.success, bg: Colors.successLight },
  booking:      { icon: 'calendar',          color: Colors.primary, bg: Colors.infoLight },
  cancellation: { icon: 'close-circle',      color: Colors.error,   bg: Colors.errorLight },
  reminder:     { icon: 'alarm',             color: Colors.warning, bg: Colors.warningLight },
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Marcar tudo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Unread count */}
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <View style={styles.unreadDot} />
          <Text style={styles.unreadText}>{unreadCount} notificação{unreadCount > 1 ? 'ões' : ''} não lida{unreadCount > 1 ? 's' : ''}</Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} onPress={() => setNotifications((prev) => prev.map((n) => n.id === item.id ? { ...n, read: true } : n))} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Sem notificações</Text>
            <Text style={styles.emptyDesc}>Você está em dia com tudo!</Text>
          </View>
        }
      />
    </View>
  );
}

function NotificationItem({ item, onPress }: { item: Notification; onPress: () => void }) {
  const cfg = TYPE_CONFIG[item.type];
  return (
    <TouchableOpacity style={[styles.notifCard, !item.read && styles.notifCardUnread]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.notifIcon, { backgroundColor: cfg.bg }]}>
        <Ionicons name={cfg.icon as any} size={22} color={cfg.color} />
      </View>
      <View style={styles.notifContent}>
        <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>{item.title}</Text>
        <Text style={styles.notifMessage} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, gap: Spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  markAllBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, backgroundColor: Colors.infoLight },
  markAllText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  unreadBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm, backgroundColor: Colors.infoLight, borderRadius: BorderRadius.md, paddingHorizontal: 12, paddingVertical: 8 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  unreadText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: 30 },
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md, ...Shadow.sm },
  notifCardUnread: { borderLeftWidth: 3, borderLeftColor: Colors.primary, backgroundColor: '#FAFBFF' },
  notifIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifContent: { flex: 1, gap: 4 },
  notifTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  notifTitleUnread: { fontWeight: '800' },
  notifMessage: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  notifTime: { fontSize: 11, color: Colors.textMuted },
  unreadIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, flexShrink: 0, marginTop: 4 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptyDesc: { fontSize: 14, color: Colors.textSecondary },
});
