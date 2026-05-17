import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors, Spacing, BorderRadius, Shadow } from "@/constants/theme";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const MENU_ITEMS = [
  {
    icon: "person-outline",
    label: "Dados pessoais",
    sub: "Nome, email, telefone",
  }
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <LinearGradient colors={["#6C63FF", "#8B5CF6"]} style={styles.header}>
          <View style={styles.circle1} />
          <View style={styles.avatarArea}>
            <View style={styles.avatarWrap}>
              <Avatar initials={initials} size="xl" />
              <TouchableOpacity style={styles.editPhoto}>
                <Ionicons name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{user?.name ?? "—"}</Text>
            <Text style={styles.email}>{user?.email ?? "—"}</Text>
          </View>
        </LinearGradient>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                idx < MENU_ITEMS.length - 1 && styles.menuItemBorder,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>NaHora </Text>
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
  header: { paddingBottom: 30, overflow: "hidden" },
  circle1: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -40,
    right: -30,
  },
  avatarArea: { alignItems: "center", paddingTop: Spacing.lg },
  avatarWrap: { position: "relative", marginBottom: Spacing.sm },
  editPhoto: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: { fontSize: 22, fontWeight: "800", color: "#fff", marginBottom: 4 },
  email: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 8 },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  memberText: { fontSize: 12, fontWeight: "700", color: "#F59E0B" },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statValue: { fontSize: 20, fontWeight: "800", color: Colors.textPrimary },
  statLabel: { fontSize: 10, color: Colors.textSecondary, textAlign: "center" },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    margin: Spacing.lg,
    marginBottom: 0,
    overflow: "hidden",
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.infoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
  menuSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: Spacing.lg,
    marginBottom: 0,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.errorLight,
    backgroundColor: Colors.errorLight,
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: Colors.error },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
  },
});
