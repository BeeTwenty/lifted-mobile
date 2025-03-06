
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
      importance: "high",
      foreground: true,
      createDefaultChannel: true,
      pressAction: {
        id: "default",
        launchActivity: "MainActivity"
      }
    }
  },
  bundledWebRuntime: false
};

export default config;
