const Mafio = require('./app');
const config = require('./config');

const main = async () => {
  try {
    const server = await Mafio.createServer(config);
    await server.start();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

main();
