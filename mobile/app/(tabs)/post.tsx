// app/(tabs)/post.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/config';
import PostCard from '../../components/Post/PostCard';
import CategorySortBar from '../../components/Post/CategorySortBar';
import ProfileHeader from '../../components/Profile/ProfileHeader';

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

type SortOption = 'recent' | 'liked' | 'commented';
const CATEGORIES = ['All', 'Design', 'Code', 'Art', 'Photography'];

function mockStatsFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  }
  return {
    likes: hash % 50,
    comments: hash % 12,
    category: CATEGORIES[(hash % (CATEGORIES.length - 1)) + 1],
  };
}

// A tagged union: every row in the list is either the filter bar
// or a post, and TypeScript narrows which fields are available
// based on which "type" it is once you check it.
type ListRow = { type: 'filter' } | ({ type: 'post' } & Post);

export default function PostScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api.get('/api/posts')
      .then(res => {
        const withMockStats = res.data.map((post: any) => ({
          ...post,
          ...mockStatsFor(post._id),
        }));
        setPosts(withMockStats);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    result = [...result].sort((a, b) => {
      if (sortBy === 'liked') return b.likes - a.likes;
      if (sortBy === 'commented') return b.comments - a.comments;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [posts, sortBy, category]);

  // First row is always the filter sentinel; the rest are posts.
  // This is what makes the filter bar occupy a real, sticky-able index.
  const listData: ListRow[] = useMemo(
    () => [{ type: 'filter' }, ...filteredPosts.map(p => ({ type: 'post' as const, ...p }))],
    [filteredPosts]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        keyExtractor={item => (item.type === 'filter' ? 'filter-bar' : item._id)}
        ListHeaderComponent={
          <ProfileHeader
            name="Wakai One"
            handle="@levelorigin"
            roles={['Game Developer', 'Software Developer']}
            bio="I build worlds from scratch — rigging characters in Blender, scripting economies in Unity, and shipping apps on the side. Currently leveling up through STI while running Level Origin as an independent studio-of-one."
            stats={[
              { label: 'Projects Shipped', value: 5 },
              { label: 'Years Building', value: 3 },
              { label: 'Tools Mastered', value: 6 },
            ]}
            onDonate={() => {}}
          />
        }
        stickyHeaderIndices={[1]} // index 0 = ListHeaderComponent, index 1 = filter row
        renderItem={({ item }) =>
          item.type === 'filter' ? (
            <CategorySortBar
              sortBy={sortBy}
              setSortBy={setSortBy}
              category={category}
              setCategory={setCategory}
            />
          ) : (
            <PostCard post={item} />
          )
        }
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={() => {}}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  uploadButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});