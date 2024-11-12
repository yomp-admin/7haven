import { Hono } from 'hono';
import { setupApi } from './routes/router';
import { config } from './config/config';

const app = new Hono();

setupApi(app);

export default {
  port: config.PORT,
  fetch: app.fetch
};
