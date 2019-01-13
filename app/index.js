const Hapi = require('hapi');
const Pino = require('hapi-pino');

const auth = require('./auth');

class Mafio {
  static async createServer(options) {
    const server = Hapi.server({
      port: options.port,
    });

    await server.register({
      plugin: Pino,
      options: {
        prettyPrint: options.logging.prettyPrint,
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
        return 'Root';
      },
    });

    server.route({
      method: 'GET',
      path: '/protected',
      options: {
        auth: 'session',
        handler: (request, h) => {
          const { displayName } = request.auth.credentials;
          return `Accessible if authenticated: ${displayName}`;
        },
      },
    });

    return server;
  }
}

module.exports = Mafio;
