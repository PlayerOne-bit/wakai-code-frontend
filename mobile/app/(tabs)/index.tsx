import { useEffect, useState } from 'react';
import { FlatList, Button } from 'react-native';
import api from '../../api/config';
import PostCard from '../../components/Post/PostCard';
import { useAuth } from '../../context/AuthContext';

type Post = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  author: string;
  createdAt: string;
};

export default function HomeScreen() {
  const { logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item._id}
      renderItem={({ item }) => <PostCard post={item} />}
      ListHeaderComponent={<Button title="Log Out (test)" onPress={logout} />}
    />
  );
}