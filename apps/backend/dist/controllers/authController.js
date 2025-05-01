"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const swifinRestService_1 = require("../services/swifinRestService");
const userService_1 = require("../services/userService");
const authenticateUser = async (req, res) => {
    const { swifinId, password } = req.body;
    if (!swifinId || !password) {
        return res.status(400).json({ error: 'Swifin ID and password are required' });
    }
    try {
        const profile = await (0, swifinRestService_1.authenticateSwifinUser)(swifinId, password);
        if (!profile) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        let user = await (0, userService_1.getUserBySwifinId)(swifinId);
        if (!user) {
            const { swifinId: profileSwifinId, ...restProfile } = profile;
            user = await (0, userService_1.createUser)({ ...restProfile, swifinId }); // ✅ Corrected order
        }
        if (user.profileConfirmed) {
            return res.status(200).json({ redirect: '/dashboard', profile: user });
        }
        else {
            return res.status(200).json({ redirect: '/confirm-profile', profile: user });
        }
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
};
exports.authenticateUser = authenticateUser;
