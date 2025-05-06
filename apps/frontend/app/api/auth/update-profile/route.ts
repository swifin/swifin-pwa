// apps/frontend/app/api/auth/update-profile/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const SOAP_URL = 'https://api.swifin.com/soap/members/update'
const ADMIN_ID = process.env.SWIFIN_ADMIN_ID!
const ADMIN_PW = process.env.SWIFIN_ADMIN_PW!

function buildSoapEnvelope(memberId: number, customValues: any[]) {
  const entries = customValues
    .map((cv) => {
      if (cv.possibleValueId != null) {
        return `<customValues>
  <fieldId>${cv.fieldId}</fieldId>
  <possibleValueId>${cv.possibleValueId}</possibleValueId>
</customValues>`
      } else {
        return `<customValues>
  <fieldId>${cv.fieldId}</fieldId>
  <value>${cv.value}</value>
</customValues>`
      }
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mem="http://swifin.com/members">
  <soapenv:Header/>
  <soapenv:Body>
    <mem:updateMember>
      <member>
        <id>${memberId}</id>
        ${entries}
      </member>
    </mem:updateMember>
  </soapenv:Body>
</soapenv:Envelope>`
}

export async function POST(req: NextRequest) {
  try {
    const { memberId, customValues, email } = await req.json()
    if (!memberId || !customValues) {
      return NextResponse.json(
        { message: 'Invalid payload' },
        { status: 400 }
      )
    }

    // Build SOAP request
    const authHeader =
      'Basic ' +
      Buffer.from(`${ADMIN_ID}:${ADMIN_PW}`, 'utf8').toString('base64')
    const soapBody = buildSoapEnvelope(memberId, customValues)

    // Call SOAP
    const resp = await fetch(SOAP_URL, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'text/xml',
      },
      body: soapBody,
    })
    if (!resp.ok) {
      console.error('SOAP error:', await resp.text())
      return NextResponse.json(
        { message: 'Failed to update profile' },
        { status: resp.status }
      )
    }

    // Mark confirmed
    await prisma.user.update({
      where: { email },
      data: {
        profile_confirmed: true,
        wallet_activated: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('update-profile error', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

