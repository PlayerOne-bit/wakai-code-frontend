import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Comment = {
  _id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
};

type Post = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  likes?: string[];
  comments?: Comment[];
  category: string;
};

type Props = {
  post: Post;
  currentUserId: string;
  onLikePress: () => void;
  onCommentPress: () => void;
};

export default function PostCard({ post, currentUserId, onLikePress, onCommentPress }: Props) {
  // Normalize once at the top — everything below can safely assume
  // these are real arrays, never undefined.
  const likes = post.likes ?? [];
  const comments = post.comments ?? [];
  const liked = likes.includes(currentUserId);

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
          <TouchableOpacity style={styles.statItem} onPress={onLikePress}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={18}
              color={liked ? '#e0455f' : '#777'}
            />
            <Text style={[styles.statText, liked && styles.statTextActive]}>
              {likes.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statItem} onPress={onCommentPress}>
            <Ionicons name="chatbubble-outline" size={16} color="#777" />
            <Text style={styles.statText}>{comments.length}</Text>
          </TouchableOpacity>
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
  image: { width: '100%', height: 500, borderRadius: 8, marginBottom: 8 },
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
  statTextActive: { color: '#e0455f', fontWeight: '600' },
  date: { fontSize: 12, color: '#aaa' },
});