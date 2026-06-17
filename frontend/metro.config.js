const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Use LAN IP from start-expo.ps1 so the phone loads JS from your PC, not 127.0.0.1
if (process.env.REACT_NATIVE_PACKAGER_HOSTNAME) {
  config.server = {
    ...config.server,
    rewriteRequestUrl: (url) => {
      if (!url.includes('127.0.0.1') && !url.includes('localhost')) {
        return url;
      }
      const host = process.env.REACT_NATIVE_PACKAGER_HOSTNAME;
      return url.replace(/127\.0\.0\.1|localhost/g, host);
    },
  };
}

module.exports = config;
