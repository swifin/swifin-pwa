"use strict";
// apps/backend/src/utils/soapClient.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSoapUpdateRequest = exports.createSoapEnvelope = exports.sendSoapRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const sendSoapRequest = async (url, xmlBody) => {
    const response = await axios_1.default.post(url, xmlBody, {
        headers: { 'Content-Type': 'text/xml;charset=UTF-8' },
    });
    return response.data;
};
exports.sendSoapRequest = sendSoapRequest;
const createSoapEnvelope = (method, params) => {
    const body = Object.entries(params)
        .map(([key, value]) => `<${key}>${value}</${key}>`)
        .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:mem="http://ws.service.swifin.swi/">
      <soapenv:Header/>
      <soapenv:Body>
        <mem:${method}>
          ${body}
        </mem:${method}>
      </soapenv:Body>
    </soapenv:Envelope>`;
};
exports.createSoapEnvelope = createSoapEnvelope;
const sendSoapUpdateRequest = async (url, xmlBody) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: '',
        },
        body: xmlBody,
    });
    const text = await response.text();
    return { data: text }; // You may want to parse this later
};
exports.sendSoapUpdateRequest = sendSoapUpdateRequest;
