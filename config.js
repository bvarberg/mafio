const configuration = {
  port: process.env.PORT || '8080',
  cookie: {
    encryptionKey: process.env.COOKIE_ENCRYPTION_KEY || 'monster_monster_monster_monster_',
    isSecure: process.env.NODE_ENV !== 'development',
  },
  auth: {
    twitch: {
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
    },
  },
};

module.exports = configuration;
