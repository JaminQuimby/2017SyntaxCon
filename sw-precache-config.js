module.exports = {
  staticFileGlobs: [
    'dist/**.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,ico}'
  ],
  root: 'dist',
  stripPrefix: 'dist/',
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!\/__)/],
  ignoreUrlParametersMatching:[/^apiKey/,/^utm_/],
  runtimeCaching: [
    {
      urlPattern: /otg2017-f4d23\.firebaseapp\.com/,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 8000,
          name: 'runtime-cache'
        }
      }
    },
    {
      urlPattern: /sky\.blackbaudcdn\.net/,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 8000,
          name: 'cdn-cache'
        }
      }
    },
    {
      urlPattern: /maxcdn\.bootstrapcdn\.com/,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 8000,
          name: 'cdn-cache'
        }
      }
    }]
};
