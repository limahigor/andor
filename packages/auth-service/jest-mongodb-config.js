module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '8.0.3',
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: 'jest',
    },
    replicaSet: 'rs0',
    debug: true,
  },
};
