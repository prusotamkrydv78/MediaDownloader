import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Clipboard functionality - in production use expo-clipboard
const Clipboard = {
  getStringAsync: async () => {
    // Mock implementation - in production this would use expo-clipboard
    return '';
  },
};
import DownloadFailedModal from '../../components/DownloadFailedModal';
import QualitySelectorModal, { VideoQuality } from '../../components/QualitySelectorModal';
import { detectPlatformFromUrl, getPlatformName, isValidUrl } from '../../utils/platformDetector';
import { saveRecentUrl, getRecentUrls } from '../../utils/storage';
import { updateDownloadStats } from '../../utils/storage';

type DownloadState = 'ready' | 'downloading' | 'success' | 'failed';

export default function MainDownloadScreen() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('Auto-detect');
  const [downloadState, setDownloadState] = useState<DownloadState>('ready');
  const [status, setStatus] = useState('Ready');
  const [progress, setProgress] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);
  const [showRecentUrls, setShowRecentUrls] = useState(false);

  // Mock video qualities
  const videoQualities: VideoQuality[] = [
    { label: '1080p (HD)', quality: '1080p', size: '~50 MB' },
    { label: '720p (HD)', quality: '720p', size: '~30 MB' },
    { label: '480p (SD)', quality: '480p', size: '~15 MB' },
    { label: '360p (Low)', quality: '360p', size: '~8 MB' },
  ];

  useEffect(() => {
    loadRecentUrls();
  }, []);

  useEffect(() => {
    if (url) {
      const detectedPlatform = detectPlatformFromUrl(url);
      if (detectedPlatform !== 'unknown') {
        setPlatform(getPlatformName(detectedPlatform));
      } else {
        setPlatform('Auto-detect');
      }
    } else {
      setPlatform('Auto-detect');
    }
  }, [url]);

  const loadRecentUrls = async () => {
    const urls = await getRecentUrls();
    setRecentUrls(urls);
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setUrl(text);
        setShowRecentUrls(false);
      }
    } catch (error) {
      console.error('Error pasting:', error);
    }
  };

  const handleUrlChange = (text: string) => {
    setUrl(text);
    setShowRecentUrls(text.length === 0 && recentUrls.length > 0);
  };

  const handleRecentUrlSelect = (selectedUrl: string) => {
    setUrl(selectedUrl);
    setShowRecentUrls(false);
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    if (!isValidUrl(url)) {
      Alert.alert('Invalid URL', 'Please enter a valid video URL');
      return;
    }

    // Show quality selector if not already selected
    if (!selectedQuality) {
      setShowQualityModal(true);
      return;
    }

    await saveRecentUrl(url);
    await loadRecentUrls();

    setDownloadState('downloading');
    setStatus('Fetching video information...');
    setProgress(30);
    
    // Simulate download process
    setTimeout(() => {
      setProgress(60);
      setStatus('Downloading video...');
      
      setTimeout(() => {
        const shouldFail = Math.random() > 0.7;
        
        if (shouldFail) {
          setDownloadState('failed');
          setShowErrorModal(true);
          setStatus('Ready');
          setProgress(0);
          updateDownloadStats('failed');
        } else {
          setDownloadState('success');
          setStatus('Saved to Gallery!');
          setProgress(100);
          updateDownloadStats('success');
        }
      }, 1500);
    }, 1000);
  };

  const handleQualitySelect = (quality: string) => {
    setSelectedQuality(quality);
    setShowQualityModal(false);
    // Auto-start download after quality selection
    setTimeout(() => {
      handleDownload();
    }, 300);
  };

  const handleRetry = () => {
    setShowErrorModal(false);
    setDownloadState('ready');
    setStatus('Ready');
    handleDownload();
  };

  const handleDismiss = () => {
    setShowErrorModal(false);
    setDownloadState('ready');
    setStatus('Ready');
    setProgress(0);
  };

  const handleDownloadAnother = () => {
    setDownloadState('ready');
    setStatus('Ready');
    setProgress(0);
    setUrl('');
    setSelectedQuality(null);
  };

  const getButtonContent = () => {
    switch (downloadState) {
      case 'downloading':
        return (
          <>
            <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
            <Text style={styles.downloadButtonText}>Downloading...</Text>
          </>
        );
      case 'success':
        return (
          <>
            <Ionicons name="add-outline" size={20} color="#FFFFFF" style={styles.downloadIcon} />
            <Text style={styles.downloadButtonText}>Download Another</Text>
          </>
        );
      default:
        return (
          <>
            <Ionicons name="download-outline" size={20} color="#FFFFFF" style={styles.downloadIcon} />
            <Text style={styles.downloadButtonText}>Download</Text>
          </>
        );
    }
  };

  const getButtonAction = () => {
    if (downloadState === 'success') {
      return handleDownloadAnother;
    }
    if (downloadState === 'downloading') {
      return undefined;
    }
    return handleDownload;
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Video Downloader</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.urlInput}
            placeholder="Paste YouTube, Instagram, or Pinterest URL"
            placeholderTextColor="#888888"
            value={url}
            onChangeText={handleUrlChange}
            onFocus={() => {
              if (recentUrls.length > 0 && !url) {
                setShowRecentUrls(true);
              }
            }}
            autoCapitalize="none"
            autoCorrect={false}
            editable={downloadState !== 'downloading'}
          />
          <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
            <Ionicons name="clipboard-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {showRecentUrls && recentUrls.length > 0 && (
          <View style={styles.recentUrlsContainer}>
            <Text style={styles.recentUrlsTitle}>Recent URLs</Text>
            {recentUrls.slice(0, 5).map((recentUrl, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentUrlItem}
                onPress={() => handleRecentUrlSelect(recentUrl)}
              >
                <Ionicons name="time-outline" size={16} color="#888888" />
                <Text style={styles.recentUrlText} numberOfLines={1}>
                  {recentUrl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.platformContainer}>
          <Text style={styles.platformLabel}>PLATFORM</Text>
          <View style={styles.platformSelector}>
            <Text style={styles.platformText}>{platform}</Text>
            {platform !== 'Auto-detect' && (
              <Ionicons name="checkmark-circle" size={20} color="#34C759" style={styles.platformIcon} />
            )}
          </View>
        </View>

        {selectedQuality && (
          <View style={styles.qualityBadge}>
            <Text style={styles.qualityBadgeText}>Quality: {selectedQuality}</Text>
            <TouchableOpacity onPress={() => setSelectedQuality(null)}>
              <Ionicons name="close-circle" size={16} color="#888888" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.downloadButton,
            downloadState === 'downloading' && styles.downloadButtonActive,
            downloadState === 'success' && styles.downloadButtonSuccess,
            !url.trim() && styles.downloadButtonDisabled,
          ]}
          onPress={getButtonAction()}
          disabled={downloadState === 'downloading' || !url.trim()}
        >
          {getButtonContent()}
        </TouchableOpacity>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={styles.statusRight}>
            {downloadState === 'downloading' && (
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
              </View>
            )}
            {downloadState === 'success' ? (
              <>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={styles.statusSuccess}>{status}</Text>
              </>
            ) : (
              <Text style={[
                styles.statusText,
                downloadState === 'ready' && styles.statusReady,
                downloadState === 'downloading' && styles.statusDownloading,
              ]}>
                {status}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <DownloadFailedModal
        visible={showErrorModal}
        onRetry={handleRetry}
        onDismiss={handleDismiss}
      />

      <QualitySelectorModal
        visible={showQualityModal}
        qualities={videoQualities}
        selectedQuality={selectedQuality}
        onSelect={handleQualitySelect}
        onClose={() => setShowQualityModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  urlInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  pasteButton: {
    marginLeft: 12,
    padding: 4,
  },
  recentUrlsContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  recentUrlsTitle: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recentUrlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  recentUrlText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  platformContainer: {
    marginBottom: 20,
  },
  platformLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  platformSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  platformText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  platformIcon: {
    marginLeft: 8,
  },
  qualityBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  qualityBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  downloadButtonActive: {
    opacity: 0.8,
  },
  downloadButtonSuccess: {
    backgroundColor: '#007AFF',
  },
  downloadButtonDisabled: {
    opacity: 0.5,
  },
  downloadIcon: {
    marginRight: 8,
  },
  loader: {
    marginRight: 8,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarContainer: {
    width: 100,
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  statusText: {
    color: '#888888',
    fontSize: 14,
  },
  statusReady: {
    color: '#34C759',
  },
  statusDownloading: {
    color: '#888888',
  },
  statusSuccess: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: '500',
  },
});
