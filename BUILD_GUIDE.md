# Signify Mobile App - APK Build Guide

## 🚀 Quick Setup for Testing

### Option 1: Expo Go App (Easiest for Testing)
1. Install Expo Go on your Android device
2. Scan this QR code or open this link:
   ```
   exp://exp.host/@chrisnshuti943/signify-health-app
   ```
3. The app will load directly with your production backend

### Option 2: Development Build (Recommended for Testers)
1. Install Expo Go from Play Store
2. Run this command on your development machine:
   ```bash
   npx expo start --dev-client
   ```
3. Scan the QR code with Expo Go
4. This creates a development build connected to your backend

### Option 3: Standalone APK (When EAS Build Works)

#### Current Status:
- ✅ EAS Build configured
- ✅ Dependencies updated
- ❌ Build failing due to network issues

#### When Build Works:
1. APK will be available at: https://expo.dev/accounts/chrisnshuti943/projects/signify-health-app/builds
2. Download and install on Android devices
3. App will connect to: `https://signify-backend-ogbk.onrender.com`

## 🔧 Configuration Details

### Backend URL:
- **Production**: `https://signify-backend-ogbk.onrender.com`
- **Already configured** in `src/services/api.ts`

### App Configuration:
- **Package**: `com.signify.healthapp`
- **Version**: `1.0.0`
- **Build Type**: APK (for easy distribution)

## 📱 For Testers:

### What's Working:
- ✅ Backend API connectivity
- ✅ Survey fetching
- ✅ Response submission
- ✅ Notifications system

### Testing Instructions:
1. **Install Expo Go** from Play Store
2. **Open this link**: `exp://exp.host/@chrisnshuti943/signify-health-app`
3. **Test Features**:
   - Login with admin credentials
   - View available surveys
   - Submit responses
   - Check notifications

### Alternative Testing:
If the above doesn't work, testers can:
1. Clone the repository
2. Run `npm install`
3. Run `npx expo start`
4. Scan QR code with Expo Go

## 🔄 Next Steps:

1. **Fix EAS Build**: Resolve network issues with cloud build
2. **Create APK**: Generate standalone APK for distribution
3. **Upload to GitHub**: Create release with APK file
4. **Test on Devices**: Verify functionality on real Android devices

## 📞 Support:

For any issues during testing:
- Check backend status: https://signify-backend-ogbk.onrender.com/health
- Verify network connectivity
- Ensure Expo Go is updated to latest version
