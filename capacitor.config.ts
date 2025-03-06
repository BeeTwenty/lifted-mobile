
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.lifted',
  appName: 'lifted',
  webDir: 'dist',
  server: {
    url: 'https://0a129f32-894e-4e74-ab83-0d65b4bb11ac.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
