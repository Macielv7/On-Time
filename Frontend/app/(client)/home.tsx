import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow, Typography } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import { CATEGORIES, PROFESSIONALS, type Professional } from '@/constants/mock-data';

const { width } = Dimensions.get('window');

const CATEGORY_ICONS: Record<string, string> = {
  'Barbeiro': 'cut',
  'Manicure': 'color-palette',
  'Cabeleireiro': 'flower',
  'Massagem': 'hand-right',
  'Consultoria': 'briefcase',
  'Estética': 'star',
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, Lucas 👋</Text>
            <Text style={styles.subGreeting}>Que serviço você precisa hoje?</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.notifButton}
              onPress={() => router.push('/notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <Avatar initials="LM" size="sm" />
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Pesquisar serviços ou profissionais...</Text>
          <View style={styles.filterButton}>
            <Ionicons name="options" size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.7}>
                <LinearGradient
                  colors={[cat.color + '22', cat.color + '11']}
                  style={[styles.categoryIcon, { borderColor: cat.color + '33' }]}
                >
                  <Ionicons name={(CATEGORY_ICONS[cat.name] || 'grid') as any} size={24} color={cat.color} />
                </LinearGradient>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBannerContainer}>
          <LinearGradient
            colors={['#6C63FF', '#8B5CF6', '#A78BFA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.promoBanner}
          >
            <View style={styles.promoCircle1} />
            <View style={styles.promoCircle2} />
            <View style={styles.promoContent}>
              <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeText}>🎉 OFERTA</Text>
              </View>
              <Text style={styles.promoTitle}>20% OFF</Text>
              <Text style={styles.promoSubtitle}>no primeiro agendamento</Text>
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Aproveitar agora</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.promoIllustration}>
              <Ionicons name="calendar" size={64} color="rgba(255,255,255,0.15)" />
            </View>
          </LinearGradient>
        </View>

        {/* Featured Professionals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Em destaque</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {PROFESSIONALS.map((pro) => (
            <ProfessionalCard key={pro.id} pro={pro} />
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

function ProfessionalCard({ pro }: { pro: Professional }) {
  return (
    <TouchableOpacity
      style={styles.proCard}
      onPress={() => router.push(`/(client)/professional/${pro.id}` as any)}
      activeOpacity={0.9}
    >
      {/* Color accent strip */}
      <LinearGradient
        colors={['#6C63FF', '#8B5CF6']}
        style={styles.proCardAccent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      <View style={styles.proCardContent}>
        <View style={styles.proCardLeft}>
          <Avatar initials={pro.avatar} size="lg" />
          <View style={styles.proCardBadge}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
          </View>
        </View>

        <View style={styles.proCardInfo}>
          <Text style={styles.proName}>{pro.name}</Text>
          <Text style={styles.proSpecialty}>{pro.specialty}</Text>
          <StarRating rating={pro.rating} reviewCount={pro.reviewCount} size={12} />

          <View style={styles.proMeta}>
            <View style={styles.proMetaItem}>
              <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
              <Text style={styles.proMetaText}>{pro.distance}</Text>
            </View>
            <View style={styles.proMetaSep} />
            <Text style={styles.proPrice}>
              A partir de <Text style={styles.proPriceValue}>R${pro.startingPrice}</Text>
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subGreeting: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 50,
    ...Shadow.sm,
    gap: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMuted,
  },
  filterButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  seeAll: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  categoriesRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: 4,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  promoBannerContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.md,
  },
  promoBanner: {
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    overflow: 'hidden',
  },
  promoCircle1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
    right: -30,
    top: -30,
  },
  promoCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
    right: 60,
    bottom: -20,
  },
  promoContent: {
    flex: 1,
  },
  promoBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  promoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  promoTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  promoSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 10,
  },
  promoButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  promoIllustration: {
    marginLeft: 'auto',
  },
  proCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  proCardAccent: {
    height: 3,
    width: '100%',
  },
  proCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  proCardLeft: {
    position: 'relative',
  },
  proCardBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.surface,
    borderRadius: 10,
  },
  proCardInfo: {
    flex: 1,
    gap: 3,
  },
  proName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  proSpecialty: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  proMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  proMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  proMetaText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  proMetaSep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
  },
  proPrice: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  proPriceValue: {
    fontWeight: '700',
    color: Colors.primary,
  },
});
