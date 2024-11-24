const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom configurations
module.exports = {
    ...config,
    resolver: {
        ...config.resolver,
        sourceExts: [
            'js',
            'jsx',
            'json',
            'ts',
            'tsx',
            'cjs',
            'mjs'
        ],
        assetExts: [...config.resolver.assetExts, 'ttf', 'svg'],
    },
};