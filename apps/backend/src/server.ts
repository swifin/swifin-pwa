// apps/backend/src/server.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3002;

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', routes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

