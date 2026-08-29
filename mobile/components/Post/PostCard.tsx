import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Post = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  comments: number;
  category: string;
};

export default function PostCard({ post }: { post: Post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.image} />
      ) : null}

      <Text style={styles.title}>{post.title}</Text>

      {post.description ? (
        <Text style={styles.description}>{post.description}</Text>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={16} color="#777" />
            <Text style={styles.statText}>{post.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={16} color="#777" />
            <Text style={styles.statText}>{post.comments}</Text>
          </View>
        </View>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: '100%', height: 180, borderRadius: 8, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '600' },
  description: { fontSize: 14, color: '#555', marginTop: 4 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statsRow: { flexDirection: 'row' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  statText: { marginLeft: 4, fontSize: 13, color: '#777' },
  date: { fontSize: 12, color: '#aaa' },
});