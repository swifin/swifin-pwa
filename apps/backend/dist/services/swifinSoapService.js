"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMember = exports.registerMember = void 0;
// apps/backend/src/services/swifinSoapService.ts
const axios_1 = __importDefault(require("axios"));
const soapClient_1 = require("../utils/soapClient");
const adminId = process.env.SWIFIN_ADMIN_ID;
const adminPass = process.env.SWIFIN_ADMIN_PASSWORD;
const baseUrl = process.env.SWIFIN_BASE_URL;
const adminAuth = Buffer.from(`${adminId}:${adminPass}`).toString('base64');
const registerMember = async (memberData) => {
    const xml = (0, soapClient_1.createSoapEnvelope)('registerMember', memberData);
    try {
        const { data } = await axios_1.default.post(`${baseUrl}/MemberWebService`, xml, {
            headers: {
                'Content-Type': 'text/xml',
                Authorization: `Basic ${adminAuth}`,
            },
        });
        return data;
    }
    catch (error) {
        throw new Error(`Registration failed: ${error}`);
    }
};
exports.registerMember = registerMember;
const updateMember = async (memberData) => {
    const xml = (0, soapClient_1.createSoapEnvelope)('updateMember', memberData);
    try {
        const { data } = await axios_1.default.post(`${baseUrl}/MemberWebService`, xml, {
            headers: {
                'Content-Type': 'text/xml',
                Authorization: `Basic ${adminAuth}`,
            },
        });
        return data;
    }
    catch (error) {
        throw new Error(`Profile update failed: ${error}`);
    }
};
exports.updateMember = updateMember;
