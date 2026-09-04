import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
const mockStats = {
  earnings: 12400.5,
  posts: 18,
  projects: 5,
  likes: 342,
  comments: 97,
  clients: 12,
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Dashboard</Text>
        
        <View style={styles.grid}>
          <StatCard label="Earnings" value={`$${mockStats.earnings.toFixed(2)}`} />
          <StatCard label="Posts" value={mockStats.posts} />
          <StatCard label="Projects" value={mockStats.projects} />
          <StatCard label="Likes" value={mockStats.likes} />
          <StatCard label="Comments" value={mockStats.comments} />
          <StatCard label="Clients" value={mockStats.clients} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={async () => {
            await logout();
            router.replace('/login');
          }}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
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