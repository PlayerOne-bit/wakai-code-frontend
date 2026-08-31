// components/Chat/ChatListItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ChatThread = {
  id: string;
  clientName: string;
  lastMessage: string;
  timestamp: string;
  status: 'pending' | 'accepted';
};

type Props = {
  thread: ChatThread;
  onPress: () => void;
  onAccept?: () => void;
};

export default function ChatListItem({ thread, onPress, onAccept }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={thread.status === 'pending'}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLetter}>{thread.clientName.charAt(0)}</Text>
      </View>

      <View style={styles.middle}>
        <Text style={styles.name}>{thread.clientName}</Text>
        <Text style={styles.preview} numberOfLines={1}>{thread.lastMessage}</Text>
      </View>

      {thread.status === 'pending' ? (
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.rightMeta}>
          <Text style={styles.timestamp}>{thread.timestamp}</Text>
          <Ionicons name="chevron-forward" size={16} color="#bbb" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#7a1f1f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarLetter: { color: '#fff', fontWeight: '700', fontSize: 16 },
  middle: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600' },
  preview: { fontSize: 13, color: '#888', marginTop: 2 },
  rightMeta: { alignItems: 'flex-end' },
  timestamp: { fontSize: 11, color: '#aaa', marginBottom: 4 },
  acceptButton: {
    backgroundColor: '#e0455f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  acceptButtonText: { color: '#2b0a0a', fontSize: 12, fontWeight: '700' },
});