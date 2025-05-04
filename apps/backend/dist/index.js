"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes"));
require("module-alias/register");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3002;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api', routes_1.default);
app.get('/', (_req, res) => {
    res.send('🚀 Swifin Backend API is running.');
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});
