import { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Welcome } from './src/components/Welcome';
import { Home } from './src/components/Home';
import { SurveyComponent } from './src/components/Survey';
import { Confirmation } from './src/components/Confirmation';
import { Notifications } from './src/components/Notifications';
import { Login } from './src/components/Login';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { authService } from './src/services/auth';

type Screen = 'welcome' | 'login' | 'home' | 'survey' | 'confirmation' | 'notifications';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('welcome');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setCurrentScreen('welcome');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setCurrentScreen('welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ErrorBoundary>
        <View style={styles.content}>
          {currentScreen === 'welcome' && (
            <Welcome 
              onGetStarted={() => setCurrentScreen('login')} 
            />
          )}
          {currentScreen === 'login' && (
            <Login 
              onLoginSuccess={handleLoginSuccess}
            />
          )}
          {currentScreen === 'home' && (
            <Home 
              onStartSurvey={() => setCurrentScreen('survey')}
              onViewNotifications={() => setCurrentScreen('notifications')}
              onLogout={handleLogout}
            />
          )}
          {currentScreen === 'survey' && (
            <SurveyComponent onComplete={() => setCurrentScreen('confirmation')} />
          )}
          {currentScreen === 'confirmation' && (
            <Confirmation onGoHome={() => setCurrentScreen('home')} />
          )}
          {currentScreen === 'notifications' && (
            <Notifications onBack={() => setCurrentScreen('home')} />
          )}
        </View>
      </ErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
