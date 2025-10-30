const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the workspace root so Metro can see the library source
config.watchFolders = [workspaceRoot];

// Allow Metro to resolve nested dependencies (like @react-native/virtualized-lists inside react-native)
config.resolver = {
  ...config.resolver,
};

module.exports = config;
