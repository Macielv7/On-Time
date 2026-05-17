/**
 * Hook simplificado para compatibilidade com componentes do template Expo.
 * O NaHora usa apenas light mode — retorna a cor da prop ou um fallback do theme.
 */
import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  // Retorna a cor da prop se fornecida
  if (props.light) return props.light;

  // Tenta buscar no Colors pelo nome, com fallbacks seguros
  const colorMap: Record<string, string> = {
    text: Colors.textPrimary,
    background: Colors.background,
    tint: Colors.primary,
    icon: Colors.textMuted,
    tabIconDefault: Colors.tabInactive,
    tabIconSelected: Colors.primary,
  };

  if (colorMap[colorName]) return colorMap[colorName];

  const directColor = (Colors as any)[colorName];
  if (typeof directColor === 'string') return directColor;

  return Colors.textPrimary;
}
