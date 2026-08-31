// app/(tabs)/chat.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ChatListItem, { ChatThread } from '../../components/Chat/ChatListItem';
import { SafeAreaView } from 'react-native-safe-area-context';
const MOCK_THREADS: ChatThread[] = [
  { id: '1', clientName: 'Alex Rivera', lastMessage: 'Hey, saw your portfolio — interested in a commission', timestamp: '', status: 'pending' },
  { id: '2', clientName: 'Jordan Lee', lastMessage: 'Can we hop on a call this week?', timestamp: '', status: 'pending' },
  { id: '3', clientName: 'Sam Park', lastMessage: 'Thanks for the update on the build!', timestamp: '2h ago', status: 'accepted' },
  { id: '4', clientName: 'Casey Nguyen', lastMessage: 'Sent the reference images your way', timestamp: '1d ago', status: 'accepted' },
];

type Tab = 'requests' | 'messages';

export default function ChatScreen() {
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_THREADS);
  const [activeTab, setActiveTab] = useState<Tab>('requests');

  const pendingCount = threads.filter(t => t.status === 'pending').length;
  const visibleThreads = threads.filter(t =>
    activeTab === 'requests' ? t.status === 'pending' : t.status === 'accepted'
  );

  function handleAccept(id: string) {
    setThreads(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'accepted', timestamp: 'Just now' } : t))
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.container}>
        <View style={styles.tabRow}>
            <TouchableOpacity
            style={[styles.tabButton, activeTab === 'requests' && styles.tabButtonActive]}
            onPress={() => setActiveTab('requests')}
            >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
                Requests{pendingCount > 0 ? ` (${pendingCount})` : ''}
            </Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.tabButton, activeTab === 'messages' && styles.tabButtonActive]}
            onPress={() => setActiveTab('messages')}
            >
            <Text style={[styles.tabText, activeTab === 'messages' && styles.tabTextActive]}>
                Messages
            </Text>
            </TouchableOpacity>
        </View>

        <FlatList
            data={visibleThreads}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
            <ChatListItem
                thread={item}
                onPress={() => {}}
                onAccept={() => handleAccept(item.id)}
            />
            )}
            ListEmptyComponent={
            <Text style={styles.emptyText}>
                {activeTab === 'requests' ? 'No pending requests' : 'No conversations yet'}
            </Text>
            }
        />
        </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: { borderBottomColor: '#e0455f' },
  tabText: { fontSize: 14, color: '#888', fontWeight: '600' },
  tabTextActive: { color: '#111' },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 40 },
});