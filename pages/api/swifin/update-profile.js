// ~/swifin-pwa/pages/api/swifin/update-profile.js

import { decrypt } from '@/lib/crypto';
import { getCookies } from 'cookies-next';
import countries from '@/lib/countries';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const cookies = getCookies({ req, res });
  const swifinId = decrypt(cookies.swifinId);
  const swifinPassword = decrypt(cookies.swifinPassword);

  const {
    id,
    principal,
    name,
    email,
    birthday,
    gender,
    mobilePhone,
    address,
    postalCode,
    city,
    country
  } = req.body;

  const adminAuth = Buffer.from(`${process.env.ADMIN_SWIFIN_ID}:${process.env.ADMIN_SWIFIN_PASSWORD}`).toString('base64');

  const selectedCountry = countries.find(c => c.name === country);
  const countryId = selectedCountry ? selectedCountry.id : 190; // default to UK

  const xml = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mem="http://members.webservices.cyclos.strohalm.nl/">
   <soapenv:Header/>
   <soapenv:Body>
      <mem:updateMember>
         <params>
            <id>${id}</id>
            <principalType>username</principalType>
            <principal>${principal}</principal>
            <name>${name}</name>
            <email>${email}</email>
            <fields>
              <internalName>birthday</internalName>
              <fieldId>1</fieldId>
              <displayName>Birthday</displayName>
              <value>${birthday}</value>
            </fields>
            <fields>
              <internalName>gender</internalName>
              <fieldId>2</fieldId>
              <displayName>Gender</displayName>
              <value>${gender}</value>
            </fields>
            <fields>
              <internalName>mobilePhone</internalName>
              <fieldId>8</fieldId>
              <displayName>Mobile Phone</displayName>
              <value>${mobilePhone}</value>
            </fields>
            <fields>
              <internalName>address</internalName>
              <fieldId>3</fieldId>
              <displayName>Address</displayName>
              <value>${address}</value>
            </fields>
            <fields>
              <internalName>postalCode</internalName>
              <fieldId>4</fieldId>
              <displayName>Postal Code</displayName>
              <value>${postalCode}</value>
            </fields>
            <fields>
              <internalName>city</internalName>
              <fieldId>5</fieldId>
              <displayName>City</displayName>
              <value>${city}</value>
            </fields>
            <fields>
              <internalName>country</internalName>
              <fieldId>13</fieldId>
              <displayName>Country</displayName>
              <value>${countryId}</value>
            </fields>
         </params>
      </mem:updateMember>
   </soapenv:Body>
</soapenv:Envelope>`;

  try {
    const soapRes = await fetch('http://webservice.swifin.com/services/members', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${adminAuth}`,
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': ''
      },
      body: xml
    });

    const text = await soapRes.text();

    if (text.includes('<ns2:updateMemberResponse')) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Failed to update member profile', raw: text });
    }

  } catch (err) {
    console.error('[update-profile] Error:', err);
    return res.status(500).json({ error: 'Server Error', details: err.message });
  }
}

