import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MyDownloadsScreen() {
  const router = useRouter();

  const downloads = [
    {
      id: 1,
      thumbnail: 'https://via.placeholder.com/80x60/4A90E2/FFFFFF?text=Nature',
      title: 'Nature_Video_4K_HDR...',
      url: 'youtube.com/watch?v=...',
      status: 'downloading',
      progress: 45,
      downloaded: '10MB',
      total: '22MB',
      speed: '2.4 MB/s',
    },
    {
      id: 2,
      thumbnail: 'https://via.placeholder.com/80x60/E1306C/FFFFFF?text=Travel',
      title: 'Instagram_Reel_Trave...',
      url: 'instagram.com/reel/...',
      status: 'completed',
      size: '1MB',
    },
    {
      id: 3,
      thumbnail: 'https://via.placeholder.com/80x60/FF6B6B/FFFFFF?text=Cats',
      title: 'Funny_Cats_Compilation...',
      url: 'youtube.com/watch?v=...',
      status: 'paused',
      progress: 72,
      downloaded: '10MB',
      total: '13MB',
    },
    {
      id: 4,
      thumbnail: 'https://via.placeholder.com/80x60/BD081C/FFFFFF?text=Design',
      title: 'Pinterest_Design_Idea_Liv...',
      url: 'pinterest.com/pin/...',
      status: 'error',
    },
    {
      id: 5,
      thumbnail: 'https://via.placeholder.com/80x60/FF0000/FFFFFF?text=Nike',
      title: 'Nike_Shoes_Product...',
      url: 'pinterest.com/pin/...',
      status: 'completed',
      size: '2MB',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloading':
        return '#007AFF';
      case 'completed':
        return '#34C759';
      case 'paused':
        return '#FF9500';
      case 'error':
        return '#FF3B30';
      default:
        return '#888888';
    }
  };

  const getStatusText = (download: any) => {
    switch (download.status) {
      case 'downloading':
        return 'Downloading...';
      case 'completed':
        return `Completed - ${download.size}`;
      case 'paused':
        return 'Paused';
      case 'error':
        return 'Network Error - Retry soon!';
      default:
        return download.status;
    }
  };

  const getActionIcon = (status: string) => {
    switch (status) {
      case 'downloading':
        return 'close';
      case 'completed':
        return null;
      case 'paused':
        return 'play';
      case 'error':
        return 'refresh';
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Downloads</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {downloads.map((download) => (
          <View key={download.id} style={styles.downloadItem}>
            <Image
              source={{ uri: download.thumbnail }}
              style={styles.thumbnail}
            />
            <View style={styles.downloadInfo}>
              <Text style={styles.downloadTitle} numberOfLines={1}>
                {download.title}
              </Text>
              <Text style={styles.downloadUrl} numberOfLines={1}>
                {download.url}
              </Text>
              <Text style={[styles.downloadStatus, { color: getStatusColor(download.status) }]}>
                {getStatusText(download)}
              </Text>
              {download.status === 'downloading' && download.progress !== undefined && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${download.progress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {download.downloaded} / {download.total} • {download.speed}
                  </Text>
                </View>
              )}
              {download.status === 'paused' && download.progress !== undefined && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${download.progress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {download.downloaded} / {download.total}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.actionContainer}>
              {download.status === 'completed' ? (
                <TouchableOpacity style={styles.openButton}>
                  <Text style={styles.openButtonText}>Open</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.actionButton}>
                  {getActionIcon(download.status) && (
                    <Ionicons
                      name={getActionIcon(download.status) as any}
                      size={20}
                      color={download.status === 'error' ? '#FF3B30' : '#FFFFFF'}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  downloadItem: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#333333',
  },
  downloadInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  downloadTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  downloadUrl: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 6,
  },
  downloadStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    color: '#888888',
    fontSize: 10,
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  openButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

