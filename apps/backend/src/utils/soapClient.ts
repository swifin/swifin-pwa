// apps/backend/src/utils/soapClient.ts
export const createSoapEnvelope = (method: string, params: Record<string, string>): string => {
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

