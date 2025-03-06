
# Native App Development Guide

This guide will help you set up and run the React Native version of the app.

## Prerequisites

- Node.js and npm
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- JDK 11 or newer

## Installation

Due to some dependency conflicts, you need to use the provided scripts to install dependencies:

### On Windows
```
.\install-native.ps1
```

### On macOS/Linux
```
chmod +x ./install-native.sh
./install-native.sh
```

## Running the App

1. Start the Metro bundler:
```
npx react-native start
```

2. In a separate terminal, run the app:

For Android:
```
npx react-native run-android
```

For iOS (macOS only):
```
npx react-native run-ios
```

## Troubleshooting

If you encounter any issues:

1. Make sure you've installed dependencies using the provided scripts
2. Try clearing the Metro bundler cache:
```
npx react-native start --reset-cache
```
3. For Android, try:
```
cd android && ./gradlew clean && cd .. && npx react-native run-android
```

## Development Notes

- Native-specific code is in `.native.tsx` files
- The app uses React Navigation for navigation
- For state management, the app uses React Context and React Query

