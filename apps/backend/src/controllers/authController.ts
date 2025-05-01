import { Request, Response } from 'express';
import { authenticateUser as swifinAuthenticateUser } from '../services/swifinRestService';

/**
 * Handles Swifin user authentication.
 * Accepts `swifinId` and `password` from request body, validates credentials,
 * and returns a simplified user profile.
 */
export const authenticateUser = async (req: Request, res: Response) => {
  const { swifinId, password } = req.body;

  if (!swifinId || !password) {
    return res.status(400).json({ error: 'Swifin ID and password are required.' });
  }

  try {
    const profile: any = await swifinAuthenticateUser(swifinId, password);

    if (!profile) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({
      swifinId,
      name: profile.name || '',
      email: profile.email || '',
      country: profile.country || '',
      gender: profile.gender || '',
      memberType: profile.memberType || '',
    });
  } catch (error: any) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed', details: error?.message });
  }
};

