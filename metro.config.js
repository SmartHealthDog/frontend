const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watcher: {
    // Watchman 비활성화
    watchman: {
      deferStates: [],
    },
    // 대신 Node.js watcher 사용
    watchmanPath: null,
  },
  server: {
    // 서버 설정
    port: 8081,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
