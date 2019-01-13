const Mafio = require('./app');
const config = require('./config');

const main = async () => {
  try {
    const server = await Mafio.createServer(config);

    server.events.on('log', (event, tags) => {
      console.log(event);
    });

    await server.start();
    console.log(`Mafio server running at: ${server.info.uri}`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

main();
