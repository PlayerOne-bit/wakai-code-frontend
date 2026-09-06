// components/Post/MediaItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

type Media = {
  url: string;
  type: 'image' | 'video' | 'file';
  fileName: string;
};

type Props = {
  media: Media;
  width: number;
  height: number;
};

function VideoMedia({ url, width, height }: { url: string; width: number; height: number }) {
  // useVideoPlayer must be called unconditionally at the top of a
  // component — this is exactly why video gets its own component
  // instead of branching inside a shared render function.
  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
  });

  return (
    <VideoView
      style={{ width, height, borderRadius: 8 }}
      player={player}
      nativeControls
      contentFit="contain"
    />
  );
}

export default function MediaItem({ media, width, height }: Props) {
  if (media.type === 'image') {
    return (
      <Image
        source={{ uri: media.url }}
        style={{ width, height, borderRadius: 8 }}
        resizeMode="contain"
      />
    );
  }

  if (media.type === 'video') {
    return <VideoMedia url={media.url} width={width} height={height} />;
  }

  // Generic file — no preview possible, show a placeholder chip instead
  return (
    <View style={[styles.fileBox, { width, height }]}>
      <Ionicons name="document-outline" size={32} color="#999" />
      <Text style={styles.fileName} numberOfLines={1}>{media.fileName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fileBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  fileName: { fontSize: 12, color: '#777', marginTop: 8, maxWidth: '90%' },
});