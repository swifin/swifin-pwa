import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import { sendSoapRequest } from '../utils/soapClient';
import { SOAP_URL } from '../config/constants';
import {
  updateProfile as updateUserProfile,
  createUser,
  getUserBySwifinId,
} from '../services/userService';

// GET USER BY SWIFIN ID
export const getUser = async (req: Request, res: Response) => {
  const { swifinId } = req.params;
  try {
    const user = await getUserBySwifinId(swifinId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  const { swifinId, password } = req.body;

  try {
    const user = await getUserBySwifinId(swifinId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user profile is already confirmed
    const isProfileConfirmed = user.name && user.country && user.memberType;

    if (isProfileConfirmed) {
      return res.status(200).json({
        success: true,
        redirect: '/dashboard',
        message: 'Login successful. Redirecting to dashboard...',
        user,
      });
    } else {
      return res.status(200).json({
        success: true,
        redirect: '/register',
        message: 'Login successful. Redirecting to registration for confirmation...',
        user,
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req: Request, res: Response) => {
  const { swifinId, profile } = req.body;
  try {
    const updatedUser = await updateUserProfile(swifinId, profile);
    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Profile update failed' });
  }
};

// REGISTER PROFILE
export const registerProfile = async (req: Request, res: Response) => {
  const profile = req.body;

  try {
    // Prepare SOAP body
    const soapBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.swifin.com/">
        <soapenv:Header/>
        <soapenv:Body>
            <web:registerMember>
                <member>
                    <name>${profile.name}</name>
                    <email>${profile.email}</email>
                    <!-- Add other required fields -->
                </member>
            </web:registerMember>
        </soapenv:Body>
    </soapenv:Envelope>`;

    const soapResponse = await sendSoapRequest(SOAP_URL, soapBody);

    // Extract swifinId from response (mocked here)
    const swifinId = soapResponse?.data?.swifinId || 'FAKE123456';

    const newUser = await createUser({ ...profile, swifinId });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: 'Registration failed' });
  }
};

