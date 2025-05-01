// apps/backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import { authenticateSwifinUser } from '../services/swifinRestService';
import { getUserBySwifinId, createUser } from '../services/userService';

export const authenticateUser = async (req: Request, res: Response) => {
  const { swifinId, password } = req.body;

  if (!swifinId || !password) {
    return res.status(400).json({ error: 'Swifin ID and password are required' });
  }

  try {
    const profile = await authenticateSwifinUser(swifinId, password);

    if (!profile) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let user = await getUserBySwifinId(swifinId);

    if (!user) {
      const { swifinId: profileSwifinId, ...restProfile } = profile;
      user = await createUser({ ...restProfile, swifinId }); // ✅ Corrected order
    }

    if (user.profileConfirmed) {
      return res.status(200).json({ redirect: '/dashboard', profile: user });
    } else {
      return res.status(200).json({ redirect: '/confirm-profile', profile: user });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

