"use strict";
// apps/backend/src/controllers/authController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const SWIFIN_REST_URL = 'https://api.swifin.com/rest/members/me';
const authenticateUser = async (req, res) => {
    const { swifinId, password } = req.body;
    if (!swifinId || !password) {
        return res.status(400).json({ error: 'Swifin ID and password are required' });
    }
    try {
        // 🔒 Validate against Swifin REST API
        const response = await axios_1.default.get(SWIFIN_REST_URL, {
            auth: {
                username: swifinId,
                password,
            },
        });
        const profile = response.data;
        if (!profile || !profile.username) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // 🔍 Extract custom profile fields
        const custom = {};
        for (const field of profile.customValues || []) {
            custom[field.internalName] = field.possibleValueId || field.value;
        }
        // ✅ Return pre-filled profile
        const prefilledProfile = {
            swifin_id: profile.username,
            name: profile.name || '',
            email: profile.email || '',
            birthday: custom.birthday || '',
            phone: custom.mobilePhone || '',
            address: custom.address || '',
            postal_code: custom.postalCode || '',
            city: custom.city || '',
            country: custom.country || '',
            gender: custom.gender || '',
            member_type: custom.memberType || '',
            password_hash: password,
        };
        return res.status(200).json({ profile: prefilledProfile, redirect: '/confirm-profile' });
    }
    catch (err) {
        if (axios_1.default.isAxiosError(err)) {
            console.error('[Swifin REST Auth Error]', err.response?.data || err.message);
        }
        else {
            console.error('[Unexpected Auth Error]', err);
        }
        return res.status(401).json({ error: 'Invalid Swifin ID or password' });
    }
};
exports.authenticateUser = authenticateUser;
