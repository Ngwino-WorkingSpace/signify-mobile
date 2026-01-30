import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { authService, LoginCredentials, RegisterUserData } from '../services/auth';

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [phone_number, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [district, setDistrict] = useState('');
  const [sector, setSector] = useState('');

  const handleLogin = async () => {
    if (!phone_number) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      const credentials: LoginCredentials = { phone_number };
      await authService.login(credentials);
      onLoginSuccess();
    } catch (error) {
      Alert.alert('Login Failed', 'Phone number not found. Please register first.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!phone_number || !country || !district || !sector) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const userData: RegisterUserData = {
        phone_number,
        name: name || undefined,
        country,
        district,
        sector,
      };
      await authService.register(userData);
      onLoginSuccess();
    } catch (error) {
      Alert.alert('Registration Failed', 'Unable to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Feather name="heart" size={32} color="#ffffff" />
        </View>
        <Text style={styles.title}>Signify</Text>
        <Text style={styles.subtitle}>
          {isRegistering ? 'Create your account' : 'Sign in to your account'}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Feather name="phone" size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone_number}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
        </View>

        {isRegistering && (
          <>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name (Optional)"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="globe" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="map-pin" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="District"
                value={district}
                onChangeText={setDistrict}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="map" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Sector"
                value={sector}
                onChangeText={setSector}
                autoCapitalize="words"
              />
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={isRegistering ? handleRegister : handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Please wait...' : (isRegistering ? 'Create Account' : 'Sign In')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsRegistering(!isRegistering)}
          activeOpacity={0.8}
        >
          <Text style={styles.switchText}>
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    minHeight: 600,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#18392b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#18392b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#18392b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    color: '#18392b',
    fontSize: 14,
  },
});
