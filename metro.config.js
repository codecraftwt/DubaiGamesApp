const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
    // Your custom metro configurations (if any)
};

// Merge the default Metro config with your custom config
const mergedConfig = mergeConfig(defaultConfig, customConfig);

// Wrap with Reanimated's Metro Config
module.exports = wrapWithReanimatedMetroConfig(mergedConfig);
