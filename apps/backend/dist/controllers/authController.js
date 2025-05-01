"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const swifinRestService_1 = require("../services/swifinRestService");
const userService_1 = require("../services/userService");
const authenticateUser = async (req, res) => {
    const { swifinId, password } = req.body;
    if (!swifinId || !password) {
        return res.status(400).json({ error: 'Swifin ID and password are required.' });
    }
    try {
        // 1. Authenticate via Swifin REST API
        const profile = await (0, swifinRestService_1.authenticateSwifinUser)(swifinId, password);
        if (!profile) {
            return res.status(401).json({ error: 'Invalid Swifin ID or password.' });
        }
        // 2. Extract customValues into a map
        const customMap = {};
        if (Array.isArray(profile.customValues)) {
            for (const field of profile.customValues) {
                customMap[field.internalName] = field;
            }
        }
        // 3. Build full prefilled profile from REST response
        const prefilledProfile = {
            swifinId: profile.username || swifinId,
            name: profile.name || '',
            email: profile.email || '',
            mobilePhone: customMap.mobilePhone?.value || '',
            birthday: customMap.birthday?.value || '',
            gender: customMap.gender?.possibleValueId || null,
            address: customMap.address?.value || '',
            postalCode: customMap.postalCode?.value || '',
            city: customMap.city?.value || '',
            country: customMap.country?.possibleValueId || null,
            memberType: customMap.memberType?.possibleValueId || null,
            profileConfirmed: false
        };
        // 4. Check if user exists in local DB
        let user = await (0, userService_1.getUserBySwifinId)(swifinId);
        if (user && user.profileConfirmed) {
            return res.status(200).json({
                redirect: '/dashboard',
                profile: user
            });
        }
        // 5. If not confirmed or doesn't exist, update or create local record
        user = await (0, userService_1.updateProfile)(swifinId, prefilledProfile);
        return res.status(200).json({
            redirect: '/confirm-profile',
            profile: user
        });
    }
    catch (error) {
        console.error('Authentication error:', error?.message || error);
        return res.status(500).json({ error: 'Internal Server Error. Please try again.' });
    }
};
exports.authenticateUser = authenticateUser;
