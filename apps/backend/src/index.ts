// apps/backend/src/index.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);

// ✅ Start server on 0.0.0.0 so it's externally accessible
const PORT = 3002; //parseInt(process.env.PORT || '3002', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running at http://0.0.0.0:${PORT}`);
});

