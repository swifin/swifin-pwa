"use strict";
// ✅ Step 1: Session Management via JWT
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
// 📁 apps/backend/src/lib/jwt.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'swifin-dev-secret';
function generateToken(payload, expiresIn = '1h') {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
