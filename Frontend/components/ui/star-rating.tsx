import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Props = {
  rating: number;
  size?: number;
  showNumber?: boolean;
  reviewCount?: number;
};

export function StarRating({ rating, size = 14, showNumber = true, reviewCount }: Props) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <Ionicons
          key={star}
          name={star <= Math.floor(rating) ? 'star' : star - 0.5 <= rating ? 'star-half' : 'star-outline'}
          size={size}
          color="#F59E0B"
        />
      ))}
      {showNumber && (
        <Text style={[styles.number, { fontSize: size }]}>
          {rating.toFixed(1)}
          {reviewCount !== undefined && <Text style={styles.count}> ({reviewCount})</Text>}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  number: {
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 3,
  },
  count: {
    color: Colors.textSecondary,
    fontWeight: '400',
  },
});
