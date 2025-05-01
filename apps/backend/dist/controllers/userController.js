"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProfile = exports.updateProfile = exports.loginUser = exports.getUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const soapClient_1 = require("../utils/soapClient");
const constants_1 = require("../config/constants");
const userService_1 = require("../services/userService");
// GET USER BY SWIFIN ID
const getUser = async (req, res) => {
    const { swifinId } = req.params;
    try {
        const user = await (0, userService_1.getUserBySwifinId)(swifinId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        return res.json(user);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUser = getUser;
// LOGIN
const loginUser = async (req, res) => {
    const { swifinId, password } = req.body;
    try {
        const user = await (0, userService_1.getUserBySwifinId)(swifinId);
        if (!user || !(await bcryptjs_1.default.compare(password, user.passwordHash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        return res.json({ message: 'Login successful' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Login failed' });
    }
};
exports.loginUser = loginUser;
// UPDATE PROFILE
const updateProfile = async (req, res) => {
    const { swifinId, profile } = req.body;
    try {
        const updatedUser = await (0, userService_1.updateProfile)(swifinId, profile);
        return res.json(updatedUser);
    }
    catch (error) {
        return res.status(500).json({ error: 'Profile update failed' });
    }
};
exports.updateProfile = updateProfile;
// REGISTER PROFILE
const registerProfile = async (req, res) => {
    const profile = req.body;
    try {
        // Prepare SOAP body
        const soapBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.swifin.org/">
        <soapenv:Header/>
        <soapenv:Body>
            <web:registerMember>
                <member>
                    <name>${profile.name}</name>
                    <email>${profile.email}</email>
                    <!-- Add other required fields -->
                </member>
            </web:registerMember>
        </soapenv:Body>
    </soapenv:Envelope>`;
        const soapResponse = await (0, soapClient_1.sendSoapRequest)(constants_1.SOAP_URL, soapBody);
        // Extract swifinId from response (mocked here)
        const swifinId = soapResponse?.data?.swifinId || 'FAKE123456';
        const newUser = await (0, userService_1.createUser)({ ...profile, swifinId });
        return res.status(201).json(newUser);
    }
    catch (error) {
        return res.status(500).json({ error: 'Registration failed' });
    }
};
exports.registerProfile = registerProfile;
