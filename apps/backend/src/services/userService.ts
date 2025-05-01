import prisma from '../db';

export const getUserBySwifinId = async (swifinId: string) => {
  return await prisma.user.findUnique({ where: { swifinId } });
};

export const createUser = async (data: any) => {
  return await prisma.user.create({ data });
};

export const updateProfile = async (swifinId: string, data: any) => {
  return await prisma.user.update({ where: { swifinId }, data });
};
