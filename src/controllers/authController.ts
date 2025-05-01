import { Request, Response } from 'express';

export const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return res.json({ success: true, token: 'dummy-token' });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
};
