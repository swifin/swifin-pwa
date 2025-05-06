'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { countries } from '@/utils/countries'
import { genders } from '@/utils/genders'
import { memberTypes } from '@/utils/membertypes'

interface CustomValue {
  internalName: string
  fieldId: number
  value: string
  possibleValueId?: number
}

export default function ConfirmProfilePage() {
  const router = useRouter()
  const [swifinId, setSwifinId] = useState('')
  const [profile, setProfile] = useState<{
    id?: number
    name?: string
    email?: string
    birthday?: string
    mobilePhone?: string
    gender?: string
    address?: string
    postalCode?: string
    city?: string
    country?: string
    memberType?: string
  }>({})
  const [customValues, setCustomValues] = useState<CustomValue[]>([])
  const [error, setError] = useState('')

  // grab ?swifinId=... from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('swifinId') || ''
    setSwifinId(id)
  }, [])

  // fetch profile once we have swifinId
  useEffect(() => {
    if (!swifinId) return
    fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ swifinId }),
    })
      .then((res) => res.json())
      .then((data) => {
        const cvs: CustomValue[] = data.customValues
        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          birthday: cvs.find((cv) => cv.internalName === 'birthday')?.value || '',
          mobilePhone:
            cvs.find((cv) => cv.internalName === 'mobilePhone')?.value || '',
          gender: cvs.find((cv) => cv.internalName === 'gender')?.value || '',
          address: cvs.find((cv) => cv.internalName === 'address')?.value || '',
          postalCode:
            cvs.find((cv) => cv.internalName === 'postalCode')?.value || '',
          city: cvs.find((cv) => cv.internalName === 'city')?.value || '',
          country: cvs.find((cv) => cv.internalName === 'country')?.value || '',
          memberType:
            cvs.find((cv) => cv.internalName === 'memberType')?.value || '',
        })
        setCustomValues(cvs)
      })
      .catch((e) => {
        console.error(e)
        setError('Failed to load profile')
      })
  }, [swifinId])

  // update a customValue in state
  const updateValue = (field: string, val: string | number) => {
    setCustomValues((cv) =>
      cv.map((item) =>
        item.internalName === field
          ? {
              ...item,
              value: typeof val === 'string' ? val : item.value,
              possibleValueId:
                typeof val === 'number' ? val : item.possibleValueId,
            }
          : item
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: profile.id,
        customValues,
        email: profile.email,
      }),
    })
    const data = await res.json()
    if (res.ok && data.success) {
      router.push('/dashboard')
    } else {
      setError(data.message || 'Update failed')
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Confirm Your Profile</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name (readonly) */}
        <input
          type="text"
          placeholder="Full Name"
          value={profile.name || ''}
          disabled
          className="w-full border rounded p-2 bg-gray-100"
        />

        {/* Birthday */}
        <input
          type="date"
          value={profile.birthday || ''}
          onChange={(e) => updateValue('birthday', e.target.value)}
          className="w-full border rounded p-2"
        />

        {/* Mobile Phone */}
        <input
          type="text"
          placeholder="Mobile Phone"
          value={profile.mobilePhone || ''}
          onChange={(e) => updateValue('mobilePhone', e.target.value)}
          className="w-full border rounded p-2"
        />

        {/* Gender */}
        <select
          value={
            genders.find((g) => g.name === profile.gender)?.id.toString() || ''
          }
          onChange={(e) => updateValue('gender', Number(e.target.value))}
          className="w-full border rounded p-2"
        >
          <option value="" disabled>
            Select Gender
          </option>
          {genders.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Address */}
        <input
          type="text"
          placeholder="Address"
          value={profile.address || ''}
          onChange={(e) => updateValue('address', e.target.value)}
          className="w-full border rounded p-2"
        />

        {/* Postal Code */}
        <input
          type="text"
          placeholder="Postal Code"
          value={profile.postalCode || ''}
          onChange={(e) => updateValue('postalCode', e.target.value)}
          className="w-full border rounded p-2"
        />

        {/* City */}
        <input
          type="text"
          placeholder="City"
          value={profile.city || ''}
          onChange={(e) => updateValue('city', e.target.value)}
          className="w-full border rounded p-2"
        />

        {/* Country */}
        <select
          value={
            countries.find((c) => c.name === profile.country)?.id.toString() ||
            ''
          }
          onChange={(e) => updateValue('country', Number(e.target.value))}
          className="w-full border rounded p-2"
        >
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Member Type */}
        <select
          value={
            memberTypes
              .find((m) => m.name === profile.memberType)
              ?.id.toString() || ''
          }
          onChange={(e) => updateValue('memberType', Number(e.target.value))}
          className="w-full border rounded p-2"
        >
          <option value="" disabled>
            Select Member Type
          </option>
          {memberTypes.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Confirm Profile
        </button>
      </form>
    </div>
  )
}

