// app/(tabs)/index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router,useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api/config';
import { useAuth } from '../../context/AuthContext';

type Stats = {
  posts: number;
  likes: number;
  comments: number;
  projects: number;
  clients: number;
  earnings: number;
};

type StatCardProps = {
  label: string;
  value: string | number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const { logout } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useFocusEffect(
    useCallback(() => {
      api.get('/api/dashboard/stats')
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Dashboard</Text>

        <View style={styles.grid}>
          <StatCard label="Earnings" value={`$${(stats?.earnings ?? 0).toFixed(2)}`} />
          <StatCard label="Posts" value={stats?.posts ?? 0} />
          <StatCard label="Projects" value={stats?.projects ?? 0} />
          <StatCard label="Likes" value={stats?.likes ?? 0} />
          <StatCard label="Comments" value={stats?.comments ?? 0} />
          <StatCard label="Clients" value={stats?.clients ?? 0} />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await logout();
            router.replace('/login');
          }}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 100 },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardValue: { fontSize: 22, fontWeight: '700' },
  cardLabel: { fontSize: 13, color: '#777', marginTop: 4 },
  logoutButton: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0455f',
  },
  logoutButtonText: { color: '#e0455f', fontWeight: '700', fontSize: 14 },
});