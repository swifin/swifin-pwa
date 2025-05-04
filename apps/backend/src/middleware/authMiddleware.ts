// apps/backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Extend Request type to include 'user' payload from token
export interface AuthRequest extends Request {
  user?: { email: string }
}

// Middleware to protect routes
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string }
    req.user = { email: decoded.email }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}

