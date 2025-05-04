"use strict";
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
        const response = await axios_1.default.get(SWIFIN_REST_URL, {
            auth: { username: swifinId, password },
            timeout: 5000, // Set timeout for production resilience
        });
        const profile = response.data;
        if (!profile?.username) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const custom = Object.fromEntries((profile.customValues || []).map((field) => [
            field.internalName,
            field.possibleValueId || field.value,
        ]));
        const safeProfile = {
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
        };
        // Don't return password_hash in response — store it client-side only if absolutely needed
        return res.status(200).json({ profile: safeProfile, redirect: '/confirm-profile' });
    }
    catch (err) {
        console.error('[Swifin Auth Error]', err?.response?.data || err.message);
        return res.status(401).json({ error: 'Invalid Swifin ID or password' });
    }
};
exports.authenticateUser = authenticateUser;
