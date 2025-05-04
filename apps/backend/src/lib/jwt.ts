// ✅ Step 1: Session Management via JWT

// 📁 apps/backend/src/lib/jwt.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'swifin-dev-secret'

export function generateToken(payload: object, expiresIn = '1h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET)
}
