# Signify Health App - React Native

This app helps African health ministries design simple surveys and receive continuously corrected, community-validated health data through mobile phones by this signify app. 

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo Go app (version 54.0.6 or later) installed on your iOS or Android device

## Installation
0. git clone https://github.com/Ngwino-WorkingSpace/signify-mobile.git

1. Install dependencies:
```bash
npm install
```

## Running the App

### Using Expo Go (SDK 54)

1. Start the Expo development server:
```bash
npx expo start
```

2. Scan the QR code with:
   - **iOS**: Use the Camera app or Expo Go app
   - **Android**: Use the Expo Go app

3. The app will open in Expo Go on your device

**Important**: Make sure your Expo Go app version matches SDK 54. If you see a version mismatch error, update Expo Go from the App Store/Play Store.

### Alternative Commands

- `npm run ios` - Run on iOS simulator (requires Xcode on Mac)
- `npm run android` - Run on Android emulator (requires Android Studio)
- `npm run web` - Run in web browser

### Troubleshooting

**If the app shows nothing:**
1. Check the terminal for any error messages
2. Make sure you're on the same Wi-Fi network as your computer
3. Try clearing the cache: `npx expo start -c`
4. Restart the Expo Go app on your phone

**If version mismatch:**
- Your Expo Go app must support SDK 54
- Update Expo Go to the latest version from the App Store/Play Store
- Or downgrade the project to match your Expo Go version

## Project Structure

- `App.tsx` - Main app component with navigation
- `index.js` - Entry point for Expo
- `src/components/` - All screen components
  - `Welcome.tsx` - Welcome/onboarding screen
  - `Home.tsx` - Main home screen
  - `Survey.tsx` - Health survey screen
  - `Confirmation.tsx` - Survey completion screen
  - `Notifications.tsx` - Notifications screen

## Technologies Used

- React Native 0.76.5
- Expo SDK 54
- TypeScript
- @expo/vector-icons (Feather icons)

## Features

- Welcome/onboarding screen
- Health survey with multiple question types
- Notifications system
- Community health tracking

