import prisma from '../db';

interface UserProfile {
  swifinId: string;
  name?: string;
  email?: string;
  birthday?: string;
  mobilePhone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: number | string | null;
  gender?: number | string | null;
  memberType?: number | string | null;
  profileConfirmed?: boolean;
}

export const getUserBySwifinId = async (swifinId: string) => {
  return prisma.user.findUnique({
    where: { swifinId },
  });
};

export const createUser = async (profile: UserProfile) => {
  return prisma.user.create({
    data: {
      swifinId: profile.swifinId,
      name: profile.name || '',
      email: profile.email || '',
      birthday: profile.birthday || '',
      mobilePhone: profile.mobilePhone || '',
      address: profile.address || '',
      postalCode: profile.postalCode || '',
      city: profile.city || '',
      country: profile.country ? String(profile.country) : null,
      gender: profile.gender ? String(profile.gender) : null,
      memberType: profile.memberType ? String(profile.memberType) : null,
      profileConfirmed: profile.profileConfirmed ?? false,
      passwordHash: 'external', // ✅ Dummy hash to fulfill required field
    },
  });
};

export const updateProfile = async (swifinId: string, profile: Partial<UserProfile>) => {
  return prisma.user.update({
    where: { swifinId },
    data: {
      name: profile.name,
      email: profile.email,
      birthday: profile.birthday,
      mobilePhone: profile.mobilePhone,
      address: profile.address,
      postalCode: profile.postalCode,
      city: profile.city,
      country: profile.country ? String(profile.country) : undefined,
      gender: profile.gender ? String(profile.gender) : undefined,
      memberType: profile.memberType ? String(profile.memberType) : undefined,
      profileConfirmed: profile.profileConfirmed ?? true,
      updatedAt: new Date(),
    },
  });
};

