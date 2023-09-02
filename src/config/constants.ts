export const AppConst = {
  authJwtExpiry: 86400,
  logger: {
    pinoHttp: {
      transport:
        process.env.DEBUG_LOG === 'true'
          ? { target: 'pino-pretty' }
          : undefined,
    },
  },
};
