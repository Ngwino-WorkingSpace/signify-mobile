import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <View style={styles.container}>

      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Feather name="heart" size={48} color="#ffffff" />
        </View>
        <Text style={styles.title}>Signify</Text>
      </View>


      <Text style={styles.description}>
        Signify helps protect your community by sharing simple health signals through simple surveys.
      </Text>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Feather name="users" size={32} color="#18392b" />
          </View>
          <Text style={styles.featureLabel}>Community</Text>
        </View>
        <View style={[styles.featureItem, { marginHorizontal: 16 }]}>
          <View style={styles.featureIcon}>
            <Feather name="shield" size={32} color="#18392b" />
          </View>
          <Text style={styles.featureLabel}>Safe</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Feather name="heart" size={32} color="#18392b" />
          </View>
          <Text style={styles.featureLabel}>Health</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onGetStarted}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Get Started</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#18392b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#18392b',
    marginBottom: 8,
  },
  description: {
    fontSize: 20,
    color: '#374151',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 300,
  },
  featuresContainer: {
    flexDirection: 'row',
    marginBottom: 48,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(24, 57, 43, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 14,
    color: '#4b5563',
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
