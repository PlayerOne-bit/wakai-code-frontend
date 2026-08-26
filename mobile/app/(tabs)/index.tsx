import { useEffect, useState } from 'react';
import {Text, FlatList } from 'react-native';
import api from '../../api/config';
import PostCard from '../../components/Post/PostCard';

type Post = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  author: string;
  createdAt: string;
};

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
      <>
        <FlatList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <PostCard post={item} />}
        />
      </>
  );
}