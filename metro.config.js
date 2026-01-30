const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add any additional Metro configuration here
config.resolver.alias = {
  'react-native$': 'react-native-web',
};

module.exports = config;
