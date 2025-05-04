// apps/backend/src/services/userService.ts
import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

export interface ProfileData {
  swifinId: string
  password: string
  name: string
  email: string
  phone: string
  country: string
  gender: 'male' | 'female' | 'other'
  birthday: string
}

export const upsertUserProfile = async (profile: ProfileData) => {
  const passwordHash = await hash(profile.password, 10)

  return prisma.user.upsert({
    where: { swifin_id: profile.swifinId },
    update: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      gender: profile.gender as any,
      birthday: profile.birthday,
      password_hash: passwordHash,
      profile_confirmed: true,
    },
    create: {
      swifin_id: profile.swifinId,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      gender: profile.gender as any,
      birthday: profile.birthday,
      password_hash: passwordHash,
      profile_confirmed: true,
    },
  })
}

