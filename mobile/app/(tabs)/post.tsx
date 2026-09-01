// app/(tabs)/post.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/config';
import PostCard from '../../components/Post/PostCard';
import CategorySortBar from '../../components/Post/CategorySortBar';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  likes?: string[];    // optional — matches reality, some documents don't have this
  comments?: Comment[]; // same
  category: string;
};

type SortOption = 'recent' | 'liked' | 'commented';

type ListRow = { type: 'filter' } | ({ type: 'post' } & Post);

export default function PostScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchPosts();
  }, []);

  function fetchPosts() {
    api.get('/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }

  async function handleLike(postId: string) {
    if (!user) return;

    setPosts(prev =>
      prev.map(p => {
        if (p._id !== postId) return p;

        const currentLikes = p.likes ?? [];
        const alreadyLiked = currentLikes.includes(user.id);

        return {
          ...p,
          likes: alreadyLiked
            ? currentLikes.filter(id => id !== user.id)
            : [...currentLikes, user.id],
        };
      })
    );

    try {
      await api.post(`/api/posts/${postId}/like`);
    } catch (err) {
      console.error(err);
      fetchPosts();
    }
  }

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    result = [...result].sort((a, b) => {
      const aLikes = a.likes?.length ?? 0;
      const bLikes = b.likes?.length ?? 0;
      const aComments = a.comments?.length ?? 0;
      const bComments = b.comments?.length ?? 0;

      if (sortBy === 'liked') return bLikes - aLikes;
      if (sortBy === 'commented') return bComments - aComments;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [posts, sortBy, category]);

  const listData: ListRow[] = useMemo(
    () => [{ type: 'filter' }, ...filteredPosts.map(p => ({ type: 'post' as const, ...p }))],
    [filteredPosts]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          stickyHeaderIndices={[1]}
          renderItem={({ item }) =>
            item.type === 'filter' ? (
              <CategorySortBar
                sortBy={sortBy}
                setSortBy={setSortBy}
                category={category}
                setCategory={setCategory}
              />
            ) : (
              <PostCard
                post={item}
                currentUserId={user?.id ?? ''}
                onLikePress={() => handleLike(item._id)}
                onCommentPress={() => {}}
              />
            )
          }
          contentContainerStyle={{ paddingBottom: 90 }}
        />

        <TouchableOpacity style={styles.uploadButton} onPress={() => {}}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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