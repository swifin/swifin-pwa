export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  console.log('==== Incoming Activation Data ====');
  console.log(JSON.stringify(req.body, null, 2));

  const {
    swifinId,
    name,
    email,
    birthday,
    gender,
    mobilePhone,
    address,
    postalCode,
    city,
    country,
  } = req.body;

  const adminUsername = process.env.ADMIN_SWIFIN_ID;
  const adminPassword = process.env.ADMIN_SWIFIN_PASSWORD;

  const credentials = Buffer.from(`${adminUsername}:${adminPassword}`).toString('base64');

  const soapBody = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mem="http://members.webservices.cyclos.strohalm.nl/">
  <soapenv:Header/>
  <soapenv:Body>
    <mem:updateMember>
      <params>
        <principalType>username</principalType>
        <principal>${swifinId}</principal>
        <name>${escapeXml(name)}</name>
        <email>${escapeXml(email)}</email>
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
          <value>${escapeXml(mobilePhone)}</value>
        </fields>
        <fields>
          <internalName>address</internalName>
          <fieldId>3</fieldId>
          <displayName>Address</displayName>
          <value>${escapeXml(address)}</value>
        </fields>
        <fields>
          <internalName>postalCode</internalName>
          <fieldId>4</fieldId>
          <displayName>Postal Code</displayName>
          <value>${escapeXml(postalCode)}</value>
        </fields>
        <fields>
          <internalName>city</internalName>
          <fieldId>5</fieldId>
          <displayName>City</displayName>
          <value>${escapeXml(city)}</value>
        </fields>
        <fields>
          <internalName>country</internalName>
          <fieldId>13</fieldId>
          <displayName>Country</displayName>
          <value>${country}</value>
        </fields>
      </params>
    </mem:updateMember>
  </soapenv:Body>
</soapenv:Envelope>`;

  console.log('==== SOAP Request Being Sent ====');
  console.log(soapBody);

  try {
    const soapResponse = await fetch('http://webservice.swifin.com/services/members', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': '',
      },
      body: soapBody,
    });

    const text = await soapResponse.text();
    console.log('==== SOAP Response Received ====');
    console.log(text);

    if (text.includes('<ns2:updateMemberResponse')) {
      return res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      console.error('SOAP update failed. Full response:', text);
      return res.status(400).json({ message: 'Failed to update profile', soapResponse: text });
    }
  } catch (error) {
    console.error('SOAP Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Helper to escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

