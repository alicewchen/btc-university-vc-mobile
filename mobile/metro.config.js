const { getDefaultConfig } = require('@expo/metro-config');
const { resolve } = require('path');
const { resolve: resolveModule } = require('metro-resolver');

const config = getDefaultConfig(__dirname);

const expoLinkingShim = resolve(__dirname, 'src/shims/expo-linking.ts');
const coinbaseSdkShim = resolve(__dirname, 'src/shims/coinbase-wallet-mobile-sdk.ts');
const coinbaseProviderShim = resolve(
  __dirname,
  'src/shims/coinbase-wallet-mobile-sdk-provider.ts',
);
const expoAsyncRequire = require.resolve('@expo/metro-config/build/async-require.js');

const defaultResolveRequest = config.resolver.resolveRequest ?? ((context, moduleName, platform) =>
  resolveModule(context, moduleName, platform));

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'expo-linking') {
    return {
      type: 'sourceFile',
      filePath: expoLinkingShim,
    };
  }

  if (moduleName.endsWith('@expo/metro-config/build/async-require.js')) {
    return {
      type: 'sourceFile',
      filePath: expoAsyncRequire,
    };
  }

  if (moduleName === '@coinbase/wallet-mobile-sdk') {
    return {
      type: 'sourceFile',
      filePath: coinbaseSdkShim,
    };
  }

  if (
    moduleName === '@coinbase/wallet-mobile-sdk/build/WalletMobileSDKEVMProvider' ||
    moduleName.endsWith('@coinbase/wallet-mobile-sdk/build/WalletMobileSDKEVMProvider')
  ) {
    return {
      type: 'sourceFile',
      filePath: coinbaseProviderShim,
    };
  }

  return defaultResolveRequest(context, moduleName, platform);
};

module.exports = config;
