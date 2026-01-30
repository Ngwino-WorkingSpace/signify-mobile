import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

interface HomeProps {
  onStartSurvey: () => void;
  onViewNotifications: () => void;
  onLogout?: () => void;
}

export function Home({ onStartSurvey, onViewNotifications, onLogout }: HomeProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      
      if (!currentUser) {
        console.log('No user logged in, unread count set to 0');
        setUnreadCount(0);
        return;
      }

      console.log('Loading unread count for user:', currentUser.user_id);
      const count = await apiService.getUnreadCount(currentUser.user_id);
      console.log('Unread count:', count);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
      setUnreadCount(0);
    }
  };

  return (
    <View style={styles.container}>
   
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Feather name="heart" size={24} color="#ffffff" />
          </View>
          <Text style={styles.headerTitle}>Signify</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={onViewNotifications}
            style={styles.notificationButton}
            activeOpacity={0.7}
          >
            <Feather name="bell" size={24} color="#18392b" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount.toString()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {onLogout && (
            <TouchableOpacity
              onPress={onLogout}
              style={[styles.notificationButton, { marginLeft: 8 }]}
              activeOpacity={0.7}
            >
              <Feather name="log-out" size={24} color="#18392b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.greeting}>
        <Text style={styles.greetingTitle}>Hello!</Text>
        <Text style={styles.greetingText}>
          Thank you for helping protect our community.
        </Text>
      </View>

      <View style={styles.surveyCard}>
        <View style={styles.surveyCardHeader}>
          <View style={styles.surveyIcon}>
            <Feather name="clipboard" size={28} color="#ffffff" />
          </View>
          <View style={styles.surveyCardContent}>
            <Text style={styles.surveyCardTitle}>New Health Survey</Text>
            <Text style={styles.surveyCardText}>
              You have a new health survey waiting. Takes less than 2 minutes.
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={onStartSurvey}
          style={styles.surveyButton}
          activeOpacity={0.8}
        >
          <Text style={styles.surveyButtonText}>Answer Survey</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>Your Impact</Text>
        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <View style={styles.infoDot} />
            <Text style={styles.infoText}>
              Early detection of health trends
            </Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoDot} />
            <Text style={styles.infoText}>
              Helps health authorities respond faster
            </Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoDot} />
            <Text style={styles.infoText}>
              Protects your community
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    minHeight: 600,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#18392b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18392b',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  greeting: {
    marginBottom: 32,
  },
  greetingTitle: {
    fontSize: 24,
    color: '#1f2937',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 18,
    color: '#4b5563',
  },
  surveyCard: {
    backgroundColor: '#18392b',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  surveyCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  surveyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  surveyCardContent: {
    flex: 1,
  },
  surveyCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  surveyCardText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  surveyButton: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  surveyButtonText: {
    color: '#18392b',
    fontSize: 18,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 24,
    padding: 24,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoList: {
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#18392b',
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
  },
});
