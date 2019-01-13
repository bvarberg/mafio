const Bell = require('bell');

module.exports = {
  name: 'auth',
  version: '0.1.0',
  register: async function (server, options) {
    await server.register(Bell);

    server.auth.strategy('twitch', 'bell', {
      provider: 'twitch',
      password: options.cookie.encryptionKey,
      isSecure: false,
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
            // NOTE: Redirect/render authentication error

            return 'Authentication failed due to: ' + request.auth.error.message;
          }

          // NOTE: Find/create user (or just use the values from the identity provider)
          // NOTE: Add user identifier to session
          request.yar.set('twitch_id', request.auth.credentials.profile._id);
          request.yar.set('twitch_display_name', request.auth.credentials.profile.display_name);

          // NOTE: Redirect to authenticated entry point
          return h.redirect('/');
        },
      },
    });
  },
};
