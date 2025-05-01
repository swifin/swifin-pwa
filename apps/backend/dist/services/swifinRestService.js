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
            },
            validateStatus: (status) => status >= 200 && status < 500,
        });
        console.log('Swifin API response:', response.status, response.data); // for debugging
        if (response.status === 401 || !response.data || response.data.error) {
            console.warn(`Authentication failed for ${swifinId}:`, response.data?.error || 'Unauthorized');
            return null;
        }
        const { name, email, country, gender, memberType } = response.data;
        return {
            swifinId,
            name,
            email,
            country,
            gender,
            memberType,
        };
    }
    catch (error) {
        console.error('Swifin authentication error:', error?.response?.data || error.message);
        return null;
    }
};
exports.authenticateSwifinUser = authenticateSwifinUser;
