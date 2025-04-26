// pages/api/swifin/register-member.js
import { parseStringPromise } from 'xml2js';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name,
    email,
    password,
    birthday,
    gender,
    mobilePhone,
    address,
    postalCode,
    city,
    country
  } = req.body;

  try {
    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mem="http://members.webservices.cyclos.strohalm.nl/">
        <soapenv:Header/>
        <soapenv:Body>
          <mem:registerMember>
            <params>
              <groupId>536</groupId>
              <username>${mobilePhone}</username>
              <name>${name}</name>
              <email>${email}</email>
              <loginPassword>${password}</loginPassword>

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
                <value>${country}</value>
              </fields>

            </params>
          </mem:registerMember>
        </soapenv:Body>
      </soapenv:Envelope>`;

    const response = await axios.post(
      process.env.SWIFIN_SOAP_ENDPOINT,
      soapEnvelope,
      {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8'
        }
      }
    );

    const parsed = await parseStringPromise(response.data);
    const swifinID = parsed['soap:Envelope']['soap:Body'][0]['ns2:registerMemberResponse'][0]['return'][0]['username'][0];

    // Important: return as { username: swifinID }
    return res.status(200).json({ username: swifinID });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

