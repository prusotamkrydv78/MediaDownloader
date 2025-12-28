import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PermissionsScreen() {
  const router = useRouter();
  const [visible, setVisible] = React.useState(true);

  const handleGrantPermissions = () => {
    // Non-functional as requested
    setVisible(false);
  };

  const handleLater = () => {
    setVisible(false);
    router.back();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleLater}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={48} color="#FF3B30" />
          </View>
          <Text style={styles.title}>Permissions Required</Text>
          <Text style={styles.message}>
            We need storage access to save videos to your gallery. Please enable it in settings.
          </Text>
          <TouchableOpacity style={styles.grantButton} onPress={handleGrantPermissions}>
            <Ionicons name="settings-outline" size={20} color="#FFFFFF" style={styles.grantButtonIcon} />
            <Text style={styles.grantButtonText}>Grant Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLater}>
            <Text style={styles.laterText}>Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  grantButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  grantButtonIcon: {
    marginRight: 8,
  },
  grantButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  laterText: {
    color: '#888888',
    fontSize: 14,
  },
});

