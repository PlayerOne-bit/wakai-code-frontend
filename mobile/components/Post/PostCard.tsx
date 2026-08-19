import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type Post = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  author: string;
  createdAt: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <View style={styles.card}>
      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.image} />
      ) : null}

      <Text style={styles.title}>{post.title}</Text>

      {post.description ? (
        <Text style={styles.description}>{post.description}</Text>
      ) : null}

      <Text style={styles.author}>by {post.author}</Text>
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
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  author: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});