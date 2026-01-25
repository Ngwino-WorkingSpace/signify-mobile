import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface NotificationsProps {
  onBack: () => void;
}

const notifications = [
  {
    id: 1,
    type: 'survey',
    title: 'New Health Survey',
    message: 'A new health survey is available. Takes less than 2 minutes.',
    time: '10 minutes ago',
    unread: true,
  },
  {
    id: 2,
    type: 'alert',
    title: 'Community Health Update',
    message: 'Increased respiratory symptoms reported in your area. Take precautions.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 3,
    type: 'info',
    title: 'Thank You',
    message: 'Your last survey response was received. Thank you for helping your community.',
    time: '1 day ago',
    unread: false,
  },
];

export function Notifications({ onBack }: NotificationsProps) {
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
              <View
                key={notification.id}
                style={[
                  styles.notificationCard,
                  notification.unread && styles.notificationCardUnread
                ]}
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
                      {notification.unread && (
                        <View style={styles.unreadDot} />
                      )}
                    </View>
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {notification.time}
                    </Text>
                  </View>
                </View>
              </View>
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
});
