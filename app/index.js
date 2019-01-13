const Hapi = require('hapi');
const Pino = require('hapi-pino');
const Vision = require('vision');
const Ejs = require('ejs');

const auth = require('./auth');

class Mafio {
  static async createServer(options) {
    const server = Hapi.server({
      port: options.port,
    });

    // Logging
    await server.register({
      plugin: Pino,
      options: {
        prettyPrint: options.logging.prettyPrint,
      },
    });

    // Templates
    await server.register(Vision);
    server.views({
      engines: {
        ejs: Ejs
      },
      relativeTo: __dirname,
      isCached: false,
      path: './templates',
      layout: './layout/default',
      context: {
        title: 'Mafio',
      },
    });

    // Authentication
    await server.register({
      plugin: auth,
      options,
    });

    // Routes
    server.route({
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        return h.view('root');
      },
    });

    server.route({
      method: 'GET',
      path: '/protected',
      options: {
        auth: 'session',
        handler: (request, h) => {
          const { displayName } = request.auth.credentials;

          return h.view('protected', {
            displayName,
          });
        },
      },
    });

    return server;
  }
}

module.exports = Mafio;
