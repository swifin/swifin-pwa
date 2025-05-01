"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSwifinUser = void 0;
// apps/backend/src/services/swifinRestService.ts
const axios_1 = __importDefault(require("axios"));
const authenticateSwifinUser = async (swifinId, password) => {
    const baseUrl = process.env.SWIFIN_BASE_URL || 'https://api.swifin.com/rest';
    const credentials = Buffer.from(`${swifinId}:${password}`).toString('base64');
    try {
        const response = await axios_1.default.get(`${baseUrl}/members/me`, {
            headers: {
                Authorization: `Basic ${credentials}`,
                Accept: 'application/json',
            },
            validateStatus: () => true // allow all statuses
        });
        // Reject unauthorized or missing profile data
        if (response.status === 401 || !response.data || typeof response.data !== 'object') {
            console.warn(`Authentication failed for ${swifinId}: Unauthorized or invalid response`);
            return null;
        }
        // Optional: Validate key fields exist
        const { swifinId: id, name } = response.data;
        if (!id || !name) {
            console.warn(`Incomplete profile data for ${swifinId}:`, response.data);
            return null;
        }
        return response.data;
    }
    catch (error) {
        console.error('Swifin API error:', error?.response?.data || error.message);
        return null;
    }
};
exports.authenticateSwifinUser = authenticateSwifinUser;
