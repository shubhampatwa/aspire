import { registerAs } from '@nestjs/config';

export default registerAs('base', () => {
  return {
    logger: {
      pinoHttp: {
        transport:
          process.env.DEBUG_LOG === 'true'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    },
  };
});
