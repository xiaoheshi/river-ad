module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    localeDetection: true,
  },
  fallbackLng: {
    default: ['en'],
    zh: ['zh', 'en'],
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};