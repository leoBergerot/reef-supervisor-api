import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_USERNAME,
  name: process.env.DATABASE_NAME,
  type: process.env.DATABASE_TYPE,
}));