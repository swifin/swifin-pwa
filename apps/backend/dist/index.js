"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// Routes
app.use('/api', routes_1.default);
// ✅ Start server on 0.0.0.0 so it's externally accessible
const PORT = parseInt(process.env.PORT || '3002', 10);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend running at http://0.0.0.0:${PORT}`);
});
