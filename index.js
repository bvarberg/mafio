const Hapi = require('hapi');

const config = require('./config');

const server = Hapi.server({
  port: config.port,
});

const main = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

main();
