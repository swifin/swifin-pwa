import { hash } from 'bcryptjs';
import { prisma } from '../lib/prisma';

interface UserProfileInput {
  swifinId: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  gender?: string | null;
  birthday?: string | null;
}

export const upsertUserProfile = async (profile: UserProfileInput) => {
  const passwordHash = await hash(profile.password, 10);

  return prisma.user.upsert({
    where: { swifin_id: profile.swifinId },
    update: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      gender: profile.gender ?? undefined,
      birthday: profile.birthday ?? undefined,
      password_hash: passwordHash,
      profile_confirmed: true,
    },
    create: {
      swifin_id: profile.swifinId,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      gender: profile.gender ?? undefined,
      birthday: profile.birthday ?? undefined,
      password_hash: passwordHash,
      profile_confirmed: true,
    },
  });
};
