import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import { prisma } from '../lib/prisma';

// ✅ 1. Submit or update user profile
export const submitProfile = async (req: Request, res: Response) => {
  try {
    const { swifinId, password, name, email, phone, country, gender, birthday } = req.body;

    const passwordHash = await hash(password, 10);

    const user = await prisma.user.upsert({
      where: { swifin_id: swifinId },
      update: {
        name,
        email,
        phone,
        country,
        gender,
        birthday,
        password_hash: passwordHash,
        profile_confirmed: true,
      },
      create: {
        swifin_id: swifinId,
        name,
        email,
        phone,
        country,
        gender,
        birthday,
        password_hash: passwordHash,
        profile_confirmed: true,
      },
    });

    res.status(200).json({ success: true, userId: user.id });
  } catch (err) {
    console.error('Error in submitProfile:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ 2. Register new user (when Swifin ID is not provided)
export const registerNewUser = async (req: Request, res: Response) => {
  try {
    const { swifinId, password, name, email, phone, country, gender, birthday } = req.body;

    const passwordHash = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        swifin_id: swifinId,
        name,
        email,
        phone,
        country,
        gender,
        birthday,
        password_hash: passwordHash,
        profile_confirmed: true,
      },
    });

    res.status(201).json({ success: true, userId: user.id });
  } catch (err) {
    console.error('Error in registerNewUser:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ 3. Activate user wallet
export const activateWallet = async (req: Request, res: Response) => {
  try {
    const { swifinId } = req.body;

    const user = await prisma.user.findUnique({ where: { swifin_id: swifinId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.profile_confirmed) {
      return res.status(400).json({ error: 'Profile must be confirmed first' });
    }

    if (user.wallet_activated) {
      return res.status(400).json({ error: 'Wallet already activated' });
    }

    await prisma.user.update({
      where: { swifin_id: swifinId },
      data: { wallet_activated: true },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error in activateWallet:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ 4. Login user with Swifin ID + password
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { swifinId, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { swifin_id: swifinId },
      include: { wallet: true },
    });

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({
      redirect: '/wallet/activate',
      profile: {
        name: user.name,
        email: user.email,
        swifinId: user.swifin_id,
        memberType: user.member_type,
        wallet: {
          sfnc: user.wallet?.sfnc_balance.toNumber() || 0,
          sfnl: user.wallet?.sfnl_balance.toNumber() || 0,
        },
      },
    });
  } catch (err) {
    console.error('Error in loginUser:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

