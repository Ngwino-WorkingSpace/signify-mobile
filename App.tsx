import { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Welcome } from './src/components/Welcome';
import { Home } from './src/components/Home';
import { Survey } from './src/components/Survey';
import { Confirmation } from './src/components/Confirmation';
import { Notifications } from './src/components/Notifications';

type Screen = 'welcome' | 'home' | 'survey' | 'confirmation' | 'notifications';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        {currentScreen === 'welcome' && (
          <Welcome onGetStarted={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'home' && (
          <Home 
            onStartSurvey={() => setCurrentScreen('survey')}
            onViewNotifications={() => setCurrentScreen('notifications')}
          />
        )}
        {currentScreen === 'survey' && (
          <Survey onComplete={() => setCurrentScreen('confirmation')} />
        )}
        {currentScreen === 'confirmation' && (
          <Confirmation onGoHome={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'notifications' && (
          <Notifications onBack={() => setCurrentScreen('home')} />
        )}
      </View>
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
});
