import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@clerk/backend'

export function requireAuth() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      const token = authHeader.slice(7)
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      })
      ;(req as any).userId = payload.sub
      next()
    } catch {
      res.status(401).json({ error: 'Invalid token' })
    }
  }
}
