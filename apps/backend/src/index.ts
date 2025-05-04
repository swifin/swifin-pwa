// apps/backend/src/index.ts
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import routes from './routes'
import 'module-alias/register';

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3002

app.use(cors())
app.use(bodyParser.json())

app.use('/api', routes)

app.get('/', (_req, res) => {
  res.send('🚀 Swifin Backend API is running.')
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`)
})

