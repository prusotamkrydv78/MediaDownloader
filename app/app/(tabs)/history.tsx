import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HistoryItem = {
  id: number;
  thumbnail: string;
  title: string;
  time: string;
  size: string;
  status: 'downloaded' | 'failed';
  duration?: string;
  platform: 'youtube' | 'instagram' | 'pinterest';
  hasNotification?: boolean;
};

type HistorySection = {
  id: number;
  date: string;
  items: HistoryItem[];
};

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'platform'>('date');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filters = ['All', 'YouTube', 'Instagram', 'Pinterest'];

  const [historySections, setHistorySections] = useState<HistorySection[]>([
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
  ]);

  const filteredAndSortedHistory = useMemo(() => {
    let filtered = historySections.flatMap((section) =>
      section.items
        .filter((item) => {
          // Platform filter
          const platformMatch =
            activeFilter === 'All' ||
            (activeFilter === 'YouTube' && item.platform === 'youtube') ||
            (activeFilter === 'Instagram' && item.platform === 'instagram') ||
            (activeFilter === 'Pinterest' && item.platform === 'pinterest');

          // Search filter
          const searchMatch =
            !searchQuery ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.platform.toLowerCase().includes(searchQuery.toLowerCase());

          return platformMatch && searchMatch;
        })
        .map((item) => ({ ...item, date: section.date }))
    );

    // Sort
    if (sortBy === 'size') {
      filtered.sort((a, b) => {
        const sizeA = parseFloat(a.size) || 0;
        const sizeB = parseFloat(b.size) || 0;
        return sizeB - sizeA;
      });
    } else if (sortBy === 'platform') {
      filtered.sort((a, b) => a.platform.localeCompare(b.platform));
    }

    // Group back by date
    const grouped: Record<string, HistoryItem[]> = {};
    filtered.forEach((item: any) => {
      if (!grouped[item.date]) {
        grouped[item.date] = [];
      }
      grouped[item.date].push(item);
    });

    return Object.entries(grouped).map(([date, items], index) => ({
      id: index + 1,
      date,
      items,
    }));
  }, [historySections, activeFilter, searchQuery, sortBy]);

  const handleDelete = (itemId: number) => {
    Alert.alert(
      'Delete Download',
      'Are you sure you want to delete this download from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHistorySections((prev) =>
              prev.map((section) => ({
                ...section,
                items: section.items.filter((item) => item.id !== itemId),
              })).filter((section) => section.items.length > 0)
            );
          },
        },
      ]
    );
  };

  const handleShare = (item: HistoryItem) => {
    // In production, use expo-sharing
    Alert.alert('Share', `Sharing: ${item.title}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

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
        <Text style={styles.headerTitle}>History</Text>
        <TouchableOpacity onPress={() => setShowSortMenu(!showSortMenu)}>
          <Ionicons name="options-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={20} color="#888888" />
          </TouchableOpacity>
        )}
        <TouchableOpacity>
          <Ionicons name="filter" size={20} color="#888888" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {showSortMenu && (
        <View style={styles.sortMenu}>
          <Text style={styles.sortMenuTitle}>Sort By</Text>
          {['date', 'size', 'platform'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.sortOption,
                sortBy === option && styles.sortOptionActive,
              ]}
              onPress={() => {
                setSortBy(option as any);
                setShowSortMenu(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === option && styles.sortOptionTextActive,
                ]}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
              {sortBy === option && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

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
        {filteredAndSortedHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#888888" />
            <Text style={styles.emptyStateText}>No downloads found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          filteredAndSortedHistory.map((section) => (
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
                          <Ionicons
                            name="notifications"
                            size={16}
                            color="#FF3B30"
                            style={styles.notificationIcon}
                          />
                        )}
                        {getPlatformIcon(item.platform) && (
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
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Options',
                            'Choose an action',
                            [
                              { text: 'Share', onPress: () => handleShare(item) },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => handleDelete(item.id),
                              },
                              { text: 'Cancel', style: 'cancel' },
                            ]
                          );
                        }}
                      >
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
          ))
        )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  filterIcon: {
    marginLeft: 12,
  },
  sortMenu: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sortMenuTitle: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  sortOptionActive: {
    backgroundColor: '#0A0A0A',
  },
  sortOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  sortOptionTextActive: {
    color: '#007AFF',
    fontWeight: '600',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    color: '#888888',
    fontSize: 14,
    marginTop: 8,
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
