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
            '@coinbase/wallet-mobile-sdk/*': './src/shims/coinbase-wallet-mobile-sdk/*',
            '@aws-sdk/client-kms': './src/shims/aws-sdk-client-kms',
          },
        },
      ],
      'react-native-reanimated/plugin', // Must be listed last
    ],
  };
};
