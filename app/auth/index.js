const Bell = require('bell');
const CookieAuth = require('hapi-auth-cookie');

module.exports = {
  name: 'auth',
  version: '0.1.0',
  register: async function (server, options) {
    // Register the auth schemes 'cookie' and 'bell'
    await server.register([CookieAuth, Bell]);

    server.auth.strategy('session', 'cookie', {
      password: options.cookie.encryptionKey,
      isSecure: options.cookie.isSecure,
      redirectTo: '/auth/twitch',
      appendNext: true,
    });

    server.auth.strategy('twitch', 'bell', {
      provider: 'twitch',
      password: options.cookie.encryptionKey,
      isSecure: options.cookie.isSecure,
      clientId: options.auth.twitch.clientID,
      clientSecret: options.auth.twitch.clientSecret,
      scope: ['user_read'],
    });

    server.route({
      method: ['GET', 'POST'],
      path: '/auth/twitch',
      options: {
        auth: 'twitch',
        handler: (request, h) => {
          if (!request.auth.isAuthenticated) {
            // NOTE: Error view
            request.log(['error', 'auth'], request.auth.error);
            return h.redirect('/');
          }

          // NOTE: Find/create user (or just use the values from the identity provider)

          request.cookieAuth.set({
            twitchID: request.auth.credentials.profile._id,
            displayName: request.auth.credentials.profile.display_name,
          });
          request.log(['auth'], 'set Twitch credentials in cookie session');

          return h.redirect('/protected');
        },
      },
    });
  },
};
