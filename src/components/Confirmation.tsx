import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ConfirmationProps {
  onGoHome: () => void;
}

export function Confirmation({ onGoHome }: ConfirmationProps) {
  return (
    <View style={styles.container}>
      
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Feather name="check-circle" size={80} color="#18392b" />
        </View>
        <View style={styles.heartBadge}>
          <Feather name="heart" size={24} color="#ffffff" />
        </View>
      </View>

      
      <Text style={styles.title}>Thank You!</Text>
      
      <Text style={styles.description}>
        Your response helps protect your community.
      </Text>

      
      <View style={styles.impactCard}>
        <Text style={styles.impactText}>
          Health authorities will use this information to detect early warning signs and respond quickly to keep everyone safe.
        </Text>
      </View>

      
      <TouchableOpacity
        onPress={onGoHome}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    minHeight: 600,
  },
  iconContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  iconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(24, 57, 43, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heartBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#18392b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#18392b',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 20,
    color: '#374151',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 300,
  },
  impactCard: {
    backgroundColor: 'rgba(24, 57, 43, 0.05)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    width: '100%',
  },
  impactText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#18392b',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
});
