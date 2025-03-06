import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
<<<<<<< HEAD
  appId: 'com.au11no.lifted',
  appName: 'Lifted',
  webDir: 'dist'
=======
  appId: 'com.lovable.lifted',
  appName: 'lifted',
  webDir: 'dist',
  server: {
    url: 'https://0a129f32-894e-4e74-ab83-0d65b4bb11ac.lovableproject.com?forceHideBadge=true',
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
      sound: "notification.mp3",
    },
  },
  bundledWebRuntime: false
>>>>>>> 2cd7c92719addc70ebf78c36e9f7ad70cc6c6b41
};

export default config;
