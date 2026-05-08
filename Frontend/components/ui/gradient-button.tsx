import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors, BorderRadius, Typography, Spacing } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function GradientButton({ title, onPress, variant = 'primary', loading, disabled, style, textStyle, fullWidth = true, size = 'md' }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.96, { damping: 15 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15 }); };

  const sizeStyles = {
    sm: { height: 40, paddingHorizontal: 16, fontSize: 13 },
    md: { height: 52, paddingHorizontal: 24, fontSize: 15 },
    lg: { height: 60, paddingHorizontal: 32, fontSize: 16 },
  };

  const currentSize = sizeStyles[size];

  if (variant === 'primary') {
    return (
      <Animated.View style={[animatedStyle, fullWidth && { width: '100%' }]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          style={[{ borderRadius: BorderRadius.md, overflow: 'hidden' }, style]}
        >
          <LinearGradient
            colors={['#6C63FF', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.button, { height: currentSize.height, paddingHorizontal: currentSize.paddingHorizontal }, (disabled || loading) && styles.disabled]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.primaryText, { fontSize: currentSize.fontSize }, textStyle]}>{title}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'outline') {
    return (
      <AnimatedTouchable
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          animatedStyle,
          styles.button,
          styles.outlineButton,
          { height: currentSize.height, paddingHorizontal: currentSize.paddingHorizontal },
          fullWidth && { width: '100%' },
          style,
        ]}
      >
        <Text style={[styles.outlineText, { fontSize: currentSize.fontSize }, textStyle]}>{title}</Text>
      </AnimatedTouchable>
    );
  }

  if (variant === 'ghost') {
    return (
      <AnimatedTouchable
        activeOpacity={0.7}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, styles.ghostButton, fullWidth && { width: '100%' }, style]}
      >
        <Text style={[styles.ghostText, { fontSize: currentSize.fontSize }, textStyle]}>{title}</Text>
      </AnimatedTouchable>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  outlineText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  ghostButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  ghostText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
