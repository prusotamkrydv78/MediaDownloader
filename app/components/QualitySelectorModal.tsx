import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type VideoQuality = {
  label: string;
  quality: string;
  size?: string;
};

interface QualitySelectorModalProps {
  visible: boolean;
  qualities: VideoQuality[];
  selectedQuality: string | null;
  onSelect: (quality: string) => void;
  onClose: () => void;
}

export default function QualitySelectorModal({
  visible,
  qualities,
  selectedQuality,
  onSelect,
  onClose,
}: QualitySelectorModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Video Quality</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {qualities.map((quality, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.qualityItem,
                  selectedQuality === quality.quality && styles.qualityItemSelected,
                ]}
                onPress={() => {
                  onSelect(quality.quality);
                  onClose();
                }}
              >
                <View style={styles.qualityInfo}>
                  <Text style={styles.qualityLabel}>{quality.label}</Text>
                  {quality.size && (
                    <Text style={styles.qualitySize}>{quality.size}</Text>
                  )}
                </View>
                {selectedQuality === quality.quality && (
                  <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  qualityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  qualityItemSelected: {
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  qualityInfo: {
    flex: 1,
  },
  qualityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  qualitySize: {
    fontSize: 12,
    color: '#888888',
  },
});

