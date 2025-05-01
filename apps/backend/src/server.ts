// apps/backend/src/server.ts

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(userRoutes);

// Server listener
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend API running on port ${PORT}`);
});
