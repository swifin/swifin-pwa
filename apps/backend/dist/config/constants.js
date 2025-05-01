"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_PASSWORD = exports.ADMIN_SWIFIN_ID = exports.SOAP_URL = void 0;
exports.SOAP_URL = process.env.SOAP_URL || 'http://webservice.swifin.com/services/members';
exports.ADMIN_SWIFIN_ID = process.env.ADMIN_SWIFIN_ID || '';
exports.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
