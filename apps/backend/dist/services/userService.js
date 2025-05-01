"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.createUser = exports.getUserBySwifinId = void 0;
const db_1 = __importDefault(require("../db"));
const getUserBySwifinId = async (swifinId) => {
    return await db_1.default.user.findUnique({ where: { swifinId } });
};
exports.getUserBySwifinId = getUserBySwifinId;
const createUser = async (data) => {
    return await db_1.default.user.create({ data });
};
exports.createUser = createUser;
const updateProfile = async (swifinId, data) => {
    return await db_1.default.user.update({ where: { swifinId }, data });
};
exports.updateProfile = updateProfile;
