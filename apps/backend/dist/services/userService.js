"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertUserProfile = void 0;
// apps/backend/src/services/userService.ts
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = require("bcryptjs");
const upsertUserProfile = async (profile) => {
    const passwordHash = await (0, bcryptjs_1.hash)(profile.password, 10);
    return prisma_1.prisma.user.upsert({
        where: { swifin_id: profile.swifinId },
        update: {
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            country: profile.country,
            gender: profile.gender,
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
            gender: profile.gender,
            birthday: profile.birthday,
            password_hash: passwordHash,
            profile_confirmed: true,
        },
    });
};
exports.upsertUserProfile = upsertUserProfile;
