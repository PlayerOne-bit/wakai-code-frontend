// components/Post/CategorySortBar.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

type SortOption = 'recent' | 'liked' | 'commented';
const SORT_OPTIONS: SortOption[] = ['recent', 'liked', 'commented'];
const CATEGORIES = ['All', 'Design', 'Code', 'Art', 'Photography'];

type Props = {
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  category: string;
  setCategory: (c: string) => void;
};

export default function CategorySortBar({ sortBy, setSortBy, category, setCategory }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={SORT_OPTIONS}
        keyExtractor={item => item}
        contentContainerStyle={styles.chipRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, sortBy === item && styles.chipActive]}
            onPress={() => setSortBy(item)}
          >
            <Text style={[styles.chipText, sortBy === item && styles.chipTextActive]}>
              {item === 'recent' ? 'Recent' : item === 'liked' ? 'Most Liked' : 'Most Commented'}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={item => item}
        contentContainerStyle={styles.chipRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, category === item && styles.chipActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.chipText, category === item && styles.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', // solid — required so sticky bar doesn't show posts through it
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chipRow: { paddingHorizontal: 12, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#111' },
  chipText: { fontSize: 13, color: '#555' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
});