import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDownloadStats } from '../../utils/storage';

export default function SettingsScreen() {
  const [backendUrl, setBackendUrl] = useState('http://192.168.1.105:3000');
  const [autoSave, setAutoSave] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [stats, setStats] = useState({ successful: 0, failed: 0, total: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const downloadStats = await getDownloadStats();
    setStats(downloadStats);
  };

  const handleTestConnection = () => {
    // Non-functional as requested
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClearCache = () => {
    // Non-functional as requested
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Server Configuration</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Backend URL</Text>
            <View style={styles.urlInputWrapper}>
              <TextInput
                style={styles.urlInput}
                value={backendUrl}
                onChangeText={setBackendUrl}
                placeholder="http://192.168.1.105:3000"
                placeholderTextColor="#888888"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {backendUrl.length > 0 && (
                <TouchableOpacity onPress={() => setBackendUrl('')}>
                  <Ionicons name="close-circle" size={20} color="#888888" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.instructionText}>
              Ensure your device is on the same network as the server.
            </Text>
            <TouchableOpacity style={styles.testButton} onPress={handleTestConnection}>
              <Ionicons name="flash-outline" size={18} color="#FFFFFF" style={styles.testButtonIcon} />
              <Text style={styles.testButtonText}>Test Connection</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.toggleItem}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Auto-save to Gallery</Text>
            </View>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: '#333333', true: '#007AFF' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.toggleItem}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>High Quality Default</Text>
              <Text style={styles.toggleDescription}>Prefer 1080p over 720p</Text>
            </View>
            <Switch
              value={highQuality}
              onValueChange={setHighQuality}
              trackColor={{ false: '#333333', true: '#007AFF' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.toggleItem}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#333333', true: '#007AFF' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#34C759" />
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{stats.successful}</Text>
                <Text style={styles.statLabel}>Successful</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{stats.failed}</Text>
                <Text style={styles.statLabel}>Failed</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="download" size={24} color="#007AFF" />
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System</Text>
          <View style={styles.systemItem}>
            <Text style={styles.systemLabel}>Version</Text>
            <Text style={styles.systemValue}>v1.0.4</Text>
          </View>
          <TouchableOpacity style={styles.systemItem}>
            <Text style={styles.systemLabel}>Credits</Text>
            <Ionicons name="chevron-forward" size={20} color="#888888" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearCacheButton} onPress={handleClearCache}>
            <Ionicons name="trash-outline" size={18} color="#FF3B30" style={styles.clearCacheIcon} />
            <Text style={styles.clearCacheText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Video Downloader</Text>
      </View>

      {showToast && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={20} color="#34C759" />
          <Text style={styles.toastText}>Settings saved locally</Text>
        </View>
      )}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  urlInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  urlInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  instructionText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 12,
  },
  testButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testButtonIcon: {
    marginRight: 8,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 12,
    color: '#888888',
  },
  systemItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  systemLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  systemValue: {
    fontSize: 16,
    color: '#888888',
  },
  clearCacheButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  clearCacheIcon: {
    marginRight: 8,
  },
  clearCacheText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#888888',
    fontSize: 14,
  },
  toast: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  statsContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
  },
});

