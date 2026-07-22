import { createApp } from './app';

const port = Number(process.env.PORT ?? 3001);
const app = createApp();

app.listen(port, '0.0.0.0', () => {
  console.log(`API running on http://localhost:${port}/api/v1`);
});
