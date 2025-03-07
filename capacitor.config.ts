
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.au11no.lifted',
  appName: 'Lifted',
  webDir: 'dist',
  server: {
    url: 'https://workoutapp.au11no.com',
    cleartext: true,
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      signingType: 'apksigner'
    }
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "default",
      allowWhileIdle: true,
      importance: "max",
      foreground: true,
      createDefaultChannel: true,
      pressAction: {
        id: "default",
        launchActivity: "MainActivity"
      },
      visibility: "public",
      // Make Android create a notification channel by default
      androidChannelEnabled: true,
      androidChannelOptions: {
        importance: "high",
        sound: "default",
        visibility: "public",
        lightColor: "#FF0000",
        lights: true,
        vibration: true,
        badge: true,
        canBypassDnd: true,
      },
      androidChannelConfig: {
        id: "workout-timer",
        name: "Workout Timer",
        description: "Notifications for workout timers",
        importance: 5,  // Use number value 5 for high importance
        visibility: 1,  // Use number value 1 for public visibility
        sound: "default",
        vibration: true,
        lights: true,
        lightColor: "#FF0000"
      }
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
      firebaseAutoInit: true
    }
  },
  bundledWebRuntime: false
};

export default config;
