module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '7.0.3',
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: 'jest',
    },
    replicaSet: 'rs0', // Habilita replica set
    debug: true, // Logs detalhados
  },
};