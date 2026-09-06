import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Comment = {
  _id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  onSubmit: (text: string) => void;
};

export default function CommentsModal({ visible, onClose, comments, onSubmit }: Props) {
  const [text, setText] = useState('');

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.headerText}>
              Comments {comments.length > 0 ? `(${comments.length})` : ''}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={item => item._id}
            style={styles.list}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarLetter}>{item.authorName.charAt(0)}</Text>
                </View>
                <View style={styles.commentBody}>
                  <Text style={styles.commentAuthor}>{item.authorName}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No comments yet — be the first.</Text>
            }
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              value={text}
              onChangeText={setText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  backdropTouchable: { flex: 1 },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '75%',
    paddingBottom: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: { fontSize: 15, fontWeight: '700' },
  list: { paddingHorizontal: 16 },
  commentRow: { flexDirection: 'row', paddingVertical: 10 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7a1f1f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarLetter: { color: '#fff', fontWeight: '700', fontSize: 13 },
  commentBody: { flex: 1 },
  commentAuthor: { fontSize: 13, fontWeight: '600' },
  commentText: { fontSize: 13, color: '#444', marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 24, marginBottom: 24 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#e0455f',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});