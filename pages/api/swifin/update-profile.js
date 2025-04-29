/* ~/swifin-pwa/pages/api/swifin/update-profile.js */

import { decrypt } from '@/lib/crypto';
import { SOAPRequest } from '@/lib/soapClient';
import countries from '@/utils/countries';

const { SWIFIN_SOAP_ENDPOINT, ADMIN_SWIFIN_ID, ADMIN_SWIFIN_PASSWORD } = process.env;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const {
      birthday,
      mobilePhone,
      gender,
      address,
      postalCode,
      city,
      country
    } = req.body;

    const encryptedSwifinId = req.cookies?.swifinId;
    const encryptedPassword = req.cookies?.password;

    if (!encryptedSwifinId || !encryptedPassword) {
      return res.status(401).json({ message: 'Unauthorized: Missing credentials.' });
    }

    const swifinId = decrypt(encryptedSwifinId);
    const password = decrypt(encryptedPassword);

    const genderCode = gender === 'Male' ? '2' : gender === 'Female' ? '1' : '214';
    const countryId = country; // Already selected as ID

    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mem="http://members.webservices.cyclos.strohalm.nl/">
        <soapenv:Header/>
        <soapenv:Body>
          <mem:updateMember>
            <params>
              <principalType>username</principalType>
              <principal>${swifinId}</principal>

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
                <value>${genderCode}</value>
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
      </soapenv:Envelope>
    `;

    const { response } = await soapRequest({
      url: SWIFIN_SOAP_ENDPOINT,
      action: 'updateMember',
      body: soapBody,
      username: ADMIN_SWIFIN_ID,
      password: ADMIN_SWIFIN_PASSWORD,
    });

    if (!response.ok) {
      return res.status(500).json({ message: 'Failed to update profile via SOAP.' });
    }

    return res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

