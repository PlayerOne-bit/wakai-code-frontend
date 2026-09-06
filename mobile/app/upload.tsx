// app/upload.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import api from '../api/config';

const CATEGORIES = ['Design', 'Code', 'Art', 'Photography', 'Other'];

// A picked-but-not-yet-uploaded item — shape is uniform regardless of
// which picker (image, video, or document) it came from.
type PickedItem = {
  uri: string;
  name: string;
  mimeType: string;
  kind: 'image' | 'video' | 'file';
};

export default function UploadScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [items, setItems] = useState<PickedItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function pickMedia() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const newItems: PickedItem[] = result.assets.map((asset, i) => ({
      uri: asset.uri,
      name: asset.fileName ?? `media-${Date.now()}-${i}`,
      mimeType: asset.mimeType ?? (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
      kind: asset.type === 'video' ? 'video' : 'image',
    }));

    setItems(prev => [...prev, ...newItems]);
  }

  async function pickFiles() {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      type: '*/*',
    });

    if (result.canceled) return;

    const newItems: PickedItem[] = result.assets.map(asset => ({
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType ?? 'application/octet-stream',
      kind: 'file',
    }));

    setItems(prev => [...prev, ...newItems]);
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const postRes = await api.post('/api/posts', {
        title: title.trim(),
        description: description.trim(),
        category,
      });

      const newPostId = postRes.data._id;

      if (items.length > 0) {
        const formData = new FormData();
        items.forEach(item => {
          formData.append('media', {
            uri: item.uri,
            name: item.name,
            type: item.mimeType,
          } as any);
        });

        await api.post(`/api/upload/post-media/${newPostId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      router.back();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.heading}>New Post</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.pickerRow}>
        <TouchableOpacity style={styles.pickerButton} onPress={pickMedia}>
          <Ionicons name="images-outline" size={20} color="#e0455f" />
          <Text style={styles.pickerButtonText}>Photos / Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickerButton} onPress={pickFiles}>
          <Ionicons name="document-outline" size={20} color="#e0455f" />
          <Text style={styles.pickerButtonText}>Files</Text>
        </TouchableOpacity>
      </View>

      {items.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewRow}>
          {items.map((item, index) => (
            <View key={`${item.uri}-${index}`} style={styles.previewItem}>
              {item.kind === 'image' ? (
                <Image source={{ uri: item.uri }} style={styles.previewThumb} />
              ) : (
                <View style={styles.previewFileBox}>
                  <Ionicons
                    name={item.kind === 'video' ? 'videocam-outline' : 'document-outline'}
                    size={24}
                    color="#999"
                  />
                  <Text style={styles.previewFileName} numberOfLines={1}>{item.name}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.removeBadge} onPress={() => removeItem(index)}>
                <Ionicons name="close" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Post</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  heading: { fontSize: 20, fontWeight: '700' },
  pickerRow: { flexDirection: 'row', marginBottom: 12 },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdeef0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  pickerButtonText: { color: '#e0455f', fontWeight: '600', fontSize: 13, marginLeft: 6 },
  previewRow: { marginBottom: 16 },
  previewItem: { marginRight: 10, position: 'relative' },
  previewThumb: { width: 80, height: 80, borderRadius: 8 },
  previewFileBox: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  previewFileName: { fontSize: 9, color: '#777', marginTop: 4, maxWidth: 70 },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#333',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  textArea: { height: 90, textAlignVertical: 'top' },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8, marginBottom: 8 },
  categoryChipActive: { backgroundColor: '#e0455f' },
  categoryChipText: { fontSize: 13, color: '#555' },
  categoryChipTextActive: { color: '#fff', fontWeight: '600' },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
  submitButton: { backgroundColor: '#111', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});