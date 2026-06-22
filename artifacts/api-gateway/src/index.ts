import 'dotenv/config';
import app from './app';

const PORT = Number(process.env.PORT!);

app.listen(PORT, () => {
  console.log(`[api-gateway] Listening on port ${PORT}`);
});
