module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            'expo-linking': './src/shims/expo-linking',
            '@coinbase/wallet-mobile-sdk': './src/shims/coinbase-wallet-mobile-sdk',
            '@coinbase/wallet-mobile-sdk/build/WalletMobileSDKEVMProvider':
              './src/shims/coinbase-wallet-mobile-sdk-provider',
          },
        },
      ],
      'react-native-reanimated/plugin', // Must be listed last
    ],
  };
};
