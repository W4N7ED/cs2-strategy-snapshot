
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c6bc0ae871414bbb8942f35fd55dea5e',
  appName: 'cs2-strategy-snapshot',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
      androidxCore: '1.9.0',
      androidxAppcompat: '1.6.1',
      androidxCoordinatorlayout: '1.2.0',
    }
  }
};

export default config;
