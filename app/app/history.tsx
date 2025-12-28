import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'YouTube', 'Instagram', 'Pinterest'];

  const historyItems = [
    {
      id: 1,
      date: 'TODAY',
      items: [
        {
          id: 1,
          thumbnail: 'https://via.placeholder.com/100x60/4A90E2/FFFFFF?text=Nature',
          title: 'Amazing Nature Documentary - 4K...',
          time: '10:42 AM',
          size: '145.2 MB',
          status: 'downloaded',
          duration: '12:34',
          platform: 'youtube',
          hasNotification: true,
        },
        {
          id: 2,
          thumbnail: 'https://via.placeholder.com/100x60/E1306C/FFFFFF?text=Cat',
          title: 'Funny Cat Compilation #Reels',
          time: '08:16 AM',
          size: '8.2 MB',
          status: 'downloaded',
          duration: '00:41',
          platform: 'instagram',
        },
      ],
    },
    {
      id: 2,
      date: 'YESTERDAY',
      items: [
        {
          id: 3,
          thumbnail: 'https://via.placeholder.com/100x60/34C759/FFFFFF?text=Home',
          title: 'Modern Home Decor Ideas 2024',
          time: 'Oct 20',
          size: '22.1 MB',
          status: 'downloaded',
          platform: 'pinterest',
          hasNotification: true,
        },
        {
          id: 4,
          thumbnail: 'https://via.placeholder.com/100x60/FF9500/FFFFFF?text=Jazz',
          title: '10 Hours of Smooth Jazz',
          time: 'Oct 25',
          size: '-- MB',
          status: 'failed',
          platform: 'youtube',
        },
      ],
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return 'logo-youtube';
      case 'instagram':
        return 'logo-instagram';
      case 'pinterest':
        return 'logo-pinterest';
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return '#FF0000';
      case 'instagram':
        return '#E1306C';
      case 'pinterest':
        return '#BD081C';
      default:
        return '#888888';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or platform..."
          placeholderTextColor="#888888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity>
          <Ionicons name="filter" size={20} color="#888888" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterPill,
              activeFilter === filter && styles.filterPillActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {historyItems.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionDate}>{section.date}</Text>
            {section.items.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.thumbnail}
                  />
                  {item.duration && (
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{item.duration}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <View style={styles.itemHeader}>
                    <View style={styles.titleContainer}>
                      {item.hasNotification && (
                        <Ionicons name="notifications" size={16} color="#FF3B30" style={styles.notificationIcon} />
                      )}
                      {item.platform && getPlatformIcon(item.platform) && (
                        <Ionicons
                          name={getPlatformIcon(item.platform) as any}
                          size={16}
                          color={getPlatformColor(item.platform)}
                          style={styles.platformIcon}
                        />
                      )}
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                    </View>
                    <TouchableOpacity>
                      <Ionicons name="ellipsis-vertical" size={20} color="#888888" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemMeta}>
                    <Text style={styles.itemTime}>{item.time}</Text>
                    <Text style={styles.itemSeparator}>•</Text>
                    <Text style={styles.itemSize}>{item.size}</Text>
                  </View>
                  <View style={styles.itemStatus}>
                    {item.status === 'downloaded' ? (
                      <>
                        <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                        <Text style={styles.statusTextDownloaded}>Downloaded</Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="close-circle" size={16} color="#FF3B30" />
                        <Text style={styles.statusTextFailed}>Failed</Text>
                        <TouchableOpacity style={styles.retryButton}>
                          <Ionicons name="refresh" size={16} color="#FF3B30" />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            ))}
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
  headerSpacer: {
    width: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    marginRight: 12,
  },
  filterPillActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionDate: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: 100,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#333333',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: 4,
  },
  platformIcon: {
    marginRight: 4,
  },
  itemTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTime: {
    color: '#888888',
    fontSize: 12,
  },
  itemSeparator: {
    color: '#888888',
    fontSize: 12,
    marginHorizontal: 6,
  },
  itemSize: {
    color: '#888888',
    fontSize: 12,
  },
  itemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextDownloaded: {
    color: '#34C759',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusTextFailed: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  retryButton: {
    marginLeft: 8,
    padding: 4,
  },
});

