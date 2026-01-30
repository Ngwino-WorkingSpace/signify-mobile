import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { apiService, UserNotification } from '../services/api';
import { authService } from '../services/auth';

interface NotificationsProps {
  onBack: () => void;
}

export function Notifications({ onBack }: NotificationsProps) {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Get the current logged-in user
      const currentUser = await authService.getCurrentUser();
      
      if (!currentUser) {
        console.log('No user logged in, showing empty notifications');
        setNotifications([]);
        return;
      }

      console.log('Loading notifications for user:', currentUser.user_id);
      const userNotifications = await apiService.getUserNotifications(currentUser.user_id);
      console.log('Received notifications:', userNotifications);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = async (notification: UserNotification) => {
    if (!notification.is_read) {
      const result = await apiService.markNotificationAsRead(notification.user_notification_id);
      
      if (result && result.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.user_notification_id === notification.user_notification_id 
              ? { ...n, is_read: true, read_at: new Date().toISOString() }
              : n
          )
        );
        console.log('Notification marked as read successfully');
      } else {
        console.warn('Failed to mark notification as read');
      }
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'survey':
        return <Feather name="clipboard" size={24} color="#ffffff" />;
      case 'alert':
        return <Feather name="alert-circle" size={24} color="#ffffff" />;
      case 'info':
        return <Feather name="heart" size={24} color="#ffffff" />;
      default:
        return <Feather name="bell" size={24} color="#ffffff" />;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#18392b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Feather name="loader" size={32} color="#18392b" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#18392b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Feather name="bell" size={40} color="#9ca3af" />
            </View>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.user_notification_id}
                style={[
                  styles.notificationCard,
                  !notification.is_read && styles.notificationCardUnread
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                <View style={styles.notificationContent}>
                  <View style={styles.notificationIcon}>
                    {getIcon(notification.type)}
                  </View>
                  <View style={styles.notificationTextContainer}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>
                        {notification.title}
                      </Text>
                      {!notification.is_read && (
                        <View style={styles.unreadDot} />
                      )}
                    </View>
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatTimeAgo(notification.created_at)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
    marginBottom: 32,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18392b',
  },
  scrollView: {
    flex: 1,
  },
  notificationsList: {
  },
  notificationCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 16,
  },
  notificationCardUnread: {
    backgroundColor: 'rgba(24, 57, 43, 0.05)',
    borderColor: 'rgba(24, 57, 43, 0.2)',
  },
  notificationContent: {
    flexDirection: 'row',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#18392b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  notificationTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: 18,
    flex: 1,
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#18392b',
    marginLeft: 8,
  },
  notificationMessage: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    color: '#4b5563',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
});
