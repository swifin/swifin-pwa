"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.createUser = exports.getUserBySwifinId = void 0;
const db_1 = __importDefault(require("../db"));
const getUserBySwifinId = async (swifinId) => {
    return db_1.default.user.findUnique({
        where: { swifinId },
    });
};
exports.getUserBySwifinId = getUserBySwifinId;
const createUser = async (profile) => {
    return db_1.default.user.create({
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
exports.createUser = createUser;
const updateProfile = async (swifinId, profile) => {
    return db_1.default.user.update({
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
exports.updateProfile = updateProfile;
