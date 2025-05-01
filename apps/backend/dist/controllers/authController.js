"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const swifinRestService_1 = require("../services/swifinRestService");
/**
 * Handles Swifin user authentication.
 * Accepts `swifinId` and `password` from request body, validates credentials,
 * and returns a simplified user profile.
 */
const authenticateUser = async (req, res) => {
    const { swifinId, password } = req.body;
    if (!swifinId || !password) {
        return res.status(400).json({ error: 'Swifin ID and password are required.' });
    }
    try {
        const profile = await (0, swifinRestService_1.authenticateUser)(swifinId, password);
        if (!profile) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        return res.status(200).json({
            swifinId,
            name: profile.name || '',
            email: profile.email || '',
            country: profile.country || '',
            gender: profile.gender || '',
            memberType: profile.memberType || '',
        });
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Authentication failed', details: error?.message });
    }
};
exports.authenticateUser = authenticateUser;
