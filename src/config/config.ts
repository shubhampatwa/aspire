// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { bool, cleanEnv, num, port, str } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['dev', 'test', 'prod'] }),
  PORT: port({ default: 3000, devDefault: 3000 }),
  APP_VERSION: str({ default: 'v0.0.0' }),
  APP_NAME: str({ default: 'Calendly' }),

  LOG_LEVEL: str({ default: 'debug', devDefault: 'verbose' }),
  CORS: bool({ default: true, devDefault: true }),

  JWT_EXPIRATION_TIME: num({ default: 86400, devDefault: 86400 }),
  JWT_ISSUER: str({
    devDefault: 'http://localhost:3000',
    default: 'calendly',
  }),
  JWT_MFA_SECRET: str(),
  JWT_PRIVATE_KEY: str(),

  POSTGRES_URL: str(),

  SMTP_HOST: str(),
  SMTP_PORT: num(),
  SMTP_USER: str(),
  SMTP_PASS: str(),

  WEB_URL: str({ devDefault: 'http://localhost:5000' }),

  ORM_LOGGING_ENABLED: bool({ default: false, devDefault: false }),
  ORM_AUTO_MIGRATION: bool({ default: true, devDefault: false }),
});

export const AppConfig = () => ({ ...env });
