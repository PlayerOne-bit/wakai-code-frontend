import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MediaItem from './MediaItem';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 12;
const CARD_PADDING = 12;
const AVAILABLE_WIDTH = SCREEN_WIDTH - (CARD_MARGIN * 2) - (CARD_PADDING * 2);
const MEDIA_HEIGHT = 240; // fixed height for the carousel — items letterbox/fit within it via contentFit/resizeMode

type Comment = {
  _id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
};

type Media = {
  url: string;
  type: 'image' | 'video' | 'file';
  fileName: string;
};

type Post = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string; // legacy single-image posts, still supported for display
  media?: Media[];
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
  onDeletePress: () => void;
};

export default function PostCard({
  post,
  currentUserId,
  onLikePress,
  onCommentPress,
  onDeletePress,
}: Props) {
  const likes = post.likes ?? [];
  const comments = post.comments ?? [];
  const liked = likes.includes(currentUserId);
  const [activeIndex, setActiveIndex] = useState(0);

  // Combine legacy single-image posts with the new media array so
  // old posts still render exactly as before, with zero special-casing
  // anywhere else in this component.
  const mediaItems: Media[] =
    post.media && post.media.length > 0
      ? post.media
      : post.imageUrl
      ? [{ url: post.imageUrl, type: 'image', fileName: 'image' }]
      : [];

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

  function handleScroll(event: any) {
    const index = Math.round(event.nativeEvent.contentOffset.x / AVAILABLE_WIDTH);
    setActiveIndex(index);
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.deleteButton} onPress={onDeletePress}>
        <Ionicons name="trash-outline" size={16} color="#e0455f" />
      </TouchableOpacity>

      <Text style={styles.title}>{post.title}</Text>

      {post.description ? (
        <Text style={styles.description}>{post.description}</Text>
      ) : null}

      {mediaItems.length > 0 && (
        <View style={styles.mediaWrapper}>
          <FlatList
            data={mediaItems}
            keyExtractor={(_, i) => `${post._id}-media-${i}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <MediaItem media={item} width={AVAILABLE_WIDTH} height={MEDIA_HEIGHT} />
            )}
          />

          {mediaItems.length > 1 && (
            <View style={styles.dotsRow}>
              {mediaItems.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === activeIndex && styles.dotActive]}
                />
              ))}
            </View>
          )}
        </View>
      )}

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
    padding: CARD_PADDING,
    marginVertical: 6,
    marginHorizontal: CARD_MARGIN,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '600', paddingRight: 32 },
  description: { fontSize: 14, color: '#555', marginTop: 4, marginBottom: 8 },
  mediaWrapper: { marginBottom: 8 },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginHorizontal: 3,
  },
  dotActive: { backgroundColor: '#e0455f', width: 8, height: 8, borderRadius: 4 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
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