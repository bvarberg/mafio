const Hapi = require('hapi');
const Yar = require('yar');

const auth = require('./auth');

class Mafio {
  static async createServer(options) {
    const server = Hapi.server({
      port: options.port,
    });

    await server.register({
      plugin: Yar,
      options: {
        maxCookieSize: 0,
        cookieOptions: {
          password: options.cookie.encryptionKey,
          isSecure: options.cookie.isSecure,
        },
      },
    });

    await server.register({
      plugin: auth,
      options,
    });

    server.route({
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        const user = request.yar.get('twitch_display_name') || 'unknown';
        return `hello ${user}`
      },
    });

    return server;
  }
}

module.exports = Mafio;
