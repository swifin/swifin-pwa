// apps/frontend/app/admin/dashboard/components/VendorOversightPanel.tsx
'use client'

import { useEffect, useState } from 'react'
import { getVendors, toggleVendorStatus, sendVendorMessage } from '@/lib/api'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Vendor type definition
export type Vendor = {
  id: string
  type: string
  active: boolean
  name: string
  email: string
  swifinId: string
  revenue: number
}

export default function VendorOversightPanel() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filter, setFilter] = useState<string>('All')
  const [search, setSearch] = useState<string>('')
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null)

  useEffect(() => {
    fetchVendors()
  }, [])

  async function fetchVendors() {
    const data = await getVendors()
    setVendors(data)
  }

  async function handleToggle(vendorId: string, currentStatus: boolean) {
    try {
      await toggleVendorStatus(vendorId, !currentStatus)
      fetchVendors()
    } catch (err) {
      alert('Error toggling vendor status.')
    }
  }

  async function handleSendMessage(email: string) {
    const content = prompt(`Enter your message to ${email}`)
    if (content) {
      try {
        await sendVendorMessage(email, content)
        alert('Message sent.')
      } catch (e) {
        alert('Failed to send message.')
      }
    }
  }

  function exportPDF() {
    const doc = new jsPDF()
    doc.text('Vendor List', 14, 16)
    const rows = vendors.map((v) => [
      v.name,
      v.swifinId,
      v.email,
      v.type,
      `◎ ${v.revenue.toLocaleString()}`,
      v.active ? 'Active' : 'Inactive',
    ])
    doc.autoTable({ head: [['Name', 'Swifin ID', 'Email', 'Type', 'Revenue', 'Status']], body: rows })
    doc.save('vendors.pdf')
  }

  const filtered = vendors.filter((v) => {
    const matchesType = filter === 'All' || v.type === filter
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.swifinId.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter by Type:</label>
          <select
            className="border px-2 py-1 rounded text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Product</option>
            <option>Service</option>
            <option>Delivery</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search by name or Swifin ID"
          className="border px-3 py-1 rounded w-full sm:w-64 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Swifin ID</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Revenue (◎)</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <>
                <tr key={v.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 cursor-pointer" onClick={() => setExpandedVendor(v.id)}>
                    {v.name}
                  </td>
                  <td className="px-4 py-2">{v.swifinId}</td>
                  <td className="px-4 py-2">{v.email}</td>
                  <td className="px-4 py-2">{v.type}</td>
                  <td className="px-4 py-2 font-semibold text-blue-600">
                    ◎ {v.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        v.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {v.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="text-sm text-indigo-600 hover:underline mr-3"
                      onClick={() => handleSendMessage(v.email)}
                    >
                      Message
                    </button>
                    <button
                      className={`text-sm ${v.active ? 'text-red-600' : 'text-green-600'} hover:underline`}
                      onClick={() => handleToggle(v.id, v.active)}
                    >
                      {v.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
                {expandedVendor === v.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-4 py-2 text-sm text-gray-600">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><strong>Full Name:</strong> {v.name}</div>
                        <div><strong>Swifin ID:</strong> {v.swifinId}</div>
                        <div><strong>Email:</strong> {v.email}</div>
                        <div><strong>Vendor Type:</strong> {v.type}</div>
                        <div><strong>Revenue:</strong> ◎ {v.revenue.toLocaleString()}</div>
                        <div><strong>Status:</strong> {v.active ? 'Active' : 'Inactive'}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-4">
        <button
          className="bg-white border text-sm px-4 py-1 rounded shadow hover:bg-gray-50"
          onClick={exportPDF}
        >
          Export PDF
        </button>
      </div>
    </div>
  )
}

