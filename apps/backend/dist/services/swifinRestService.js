"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
// apps/backend/src/services/swifinRestService.ts
const axios_1 = __importDefault(require("axios"));
const authenticateUser = async (swifinId, password) => {
    const baseUrl = process.env.SWIFIN_BASE_URL;
    const credentials = Buffer.from(`${swifinId}:${password}`).toString('base64');
    try {
        const response = await axios_1.default.get(`${baseUrl}/member`, {
            headers: {
                Authorization: `Basic ${credentials}`,
            },
            params: { swifinId },
        });
        return response.data;
    }
    catch (error) {
        throw new Error(`Failed to fetch profile: ${error}`);
    }
};
exports.authenticateUser = authenticateUser;
