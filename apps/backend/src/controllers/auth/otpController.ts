import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';

import { 
  sendOtpToEmail,
  sendEmail
} from '@/utils/sendEmail';

import { generateOtp } from '@/utils/otp';

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otp.upsert({
      where: { email },
      update: { code, expiresAt },
      create: { email, code, expiresAt },
    });

    await sendEmail(email, 'Your OTP', `is: ${code}`);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const record = await prisma.otp.findUnique({ where: { email } });

    if (!record || record.code !== code || new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

