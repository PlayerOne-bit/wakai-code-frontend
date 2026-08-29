import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ACCENT = '#e0455f';
const AVATAR_SIZE = 84;
const COVER_HEIGHT = 130;

type Stat = { label: string; value: number };

type ProfileHeaderProps = {
  name: string;
  handle: string;
  roles: string[];
  bio: string;
  stats: Stat[];
  coverUri?: string;
  avatarUri?: string;
  onDonate: () => void;
  onChangeCover?: () => void;
  onChangeAvatar?: () => void;
};

export default function ProfileHeader({
  name,
  handle,
  roles,
  bio,
  stats,
  coverUri,
  avatarUri,
  onDonate,
  onChangeCover,
  onChangeAvatar,
}: ProfileHeaderProps) {
  const [expanded, setExpanded] = useState(false);

  function toggleExpanded() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  }

  return (
    <View style={styles.container}>
      {/* Cover photo / gradient banner */}
      <View style={styles.coverWrapper}>
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={styles.cover} />
        ) : (
          <LinearGradient
            colors={['#0a0a0a', '#4a0f0f', '#8a1c1c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cover}
          />
        )}

        <TouchableOpacity style={styles.coverEditButton} onPress={onChangeCover}>
          <Ionicons name="camera" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content block below the banner */}
      <View style={styles.content}>
        {/* Avatar — pulled upward to straddle the seam */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={42} color="#8a8a8a" />
            )}
          </View>
          <TouchableOpacity style={styles.avatarEditButton} onPress={onChangeAvatar}>
            <Ionicons name="camera" size={13} color="#2b0a0a" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle}>{handle} · {roles.join(' · ')}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.donateButton} onPress={onDonate}>
            <Ionicons name="heart" size={16} color="#2b0a0a" />
            <Text style={styles.donateButtonText}>Donate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.dropdownToggle} onPress={toggleExpanded}>
          <Text style={styles.dropdownToggleText}>
            {expanded ? 'Hide details' : 'About & stats'}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#e5b8b8"
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.details}>
            <View style={styles.statsRow}>
              {stats.map(stat => (
                <View key={stat.label} style={styles.statBlock}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.aboutHeading}>About Me</Text>
            <Text style={styles.aboutText}>{bio}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#2b0a0a' },

  coverWrapper: { height: COVER_HEIGHT, width: '100%' },
  cover: { width: '100%', height: '100%' },
  coverEditButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
  },

  content: {
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 20,
  },

  // Pulls the avatar up by half its own height, so half sits over
  // the cover and half sits over the content background below it
  avatarWrapper: {
    marginTop: -(AVATAR_SIZE / 2),
    marginBottom: 10,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2b0a0a', // matches content bg, reads as a clean ring
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2b0a0a',
  },

  name: { fontSize: 20, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: '#e5b8b8', marginTop: 4, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', marginTop: 16 },
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  donateButtonText: { color: '#2b0a0a', fontWeight: '700', marginLeft: 6, fontSize: 13 },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  secondaryButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  dropdownToggle: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  dropdownToggleText: { color: '#e5b8b8', fontSize: 13, marginRight: 4 },
  details: { width: '100%', marginTop: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  statBlock: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 11, color: '#e5b8b8', marginTop: 2, textTransform: 'uppercase' },
  aboutHeading: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 6 },
  aboutText: { fontSize: 13, color: '#e5b8b8', lineHeight: 19 },
});