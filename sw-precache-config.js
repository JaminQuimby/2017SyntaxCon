module.exports = {
  staticFileGlobs: [
    'dist/**.html',
    'dist/**.js',
    'dist/**.css',
    'dist/images/icons/*',
    'dist/images/*'
  ],
  root: 'dist',
  stripPrefix: 'dist/',
  navigateFallback: '/index.html',
  runtimeCaching: [{
  urlPattern: /otg2017-f4d23\.firebaseapp\.com/,
  handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 1000,
          name: 'runtime-cache'
        }
      }
}]
};
