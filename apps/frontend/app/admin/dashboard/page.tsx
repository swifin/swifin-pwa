// apps/frontend/app/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  getAdminSummary,
  getTopContributors,
  getActivityLogs,
} from '@/lib/api'
import GlobalReferralTree from './components/GlobalReferralTree'
import VendorOversightPanel from './components/VendorOversightPanel'

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<{
    users: number
    wallets: number
    transactions: number
    sfncTotal: number
    sfnlTotal: number
  } | null>(null)

  const [contributors, setContributors] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [logPage, setLogPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const itemsPerPage = 5

  useEffect(() => {
    async function fetchData() {
      const [summaryData, contributorData, logData] = await Promise.all([
        getAdminSummary(),
        getTopContributors(),
        getActivityLogs(),
      ])
      setSummary(summaryData)
      setContributors(contributorData)
      setLogs(logData)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>
  if (!summary) return <div className="p-6 text-red-600">Failed to load summary.</div>

  const chartData = [
    { name: 'Users', value: summary.users },
    { name: 'Wallets', value: summary.wallets },
    { name: 'Transactions', value: summary.transactions },
    { name: 'SFNC', value: summary.sfncTotal },
    { name: 'SFNL', value: summary.sfnlTotal },
  ]

  const paginatedContributors = contributors.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const paginatedLogs = logs.slice(
    (logPage - 1) * itemsPerPage,
    logPage * itemsPerPage
  )

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Users" value={summary.users} />
        <Card title="Total Wallets" value={summary.wallets} />
        <Card title="Total Transactions" value={summary.transactions} />
        <Card title="SFNC Supply" value={summary.sfncTotal} currency />
        <Card title="SFNL Supply" value={summary.sfnlTotal} currency />
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">System Overview Chart</h2>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Top Contributors (SFNL)</h2>
          <ul className="divide-y divide-gray-200">
            {paginatedContributors.map((c, idx) => (
              <li key={c.user_id} className="py-2 flex justify-between">
                <span className="text-gray-700">{(page - 1) * itemsPerPage + idx + 1}. {c.name || c.swifin_id}</span>
                <span className="font-semibold text-blue-600">◎ {c.sfnl_balance.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <Pagination page={page} setPage={setPage} total={contributors.length} perPage={itemsPerPage} />
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Recent Activity Logs</h2>
          <ul className="divide-y divide-gray-200 max-h-96 overflow-auto">
            {paginatedLogs.map((log, i) => (
              <li key={i} className="py-2 text-sm">
                <span className="text-gray-600">[{new Date(log.timestamp).toLocaleString()}]</span>{' '}
                <span className="text-gray-800 font-medium">{log.type.toUpperCase()}</span>{' '}
                <span className="text-blue-700">◎ {log.amount}</span>{' '}
                <span className="text-gray-500">by {log.name || log.swifin_id}</span>
              </li>
            ))}
          </ul>
          <Pagination page={logPage} setPage={setLogPage} total={logs.length} perPage={itemsPerPage} />
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Global Referral Tree</h2>
        <GlobalReferralTree />
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Vendor Oversight Panel</h2>
        <VendorOversightPanel />
      </div>
    </div>
  )
}

function Card({
  title,
  value,
  currency = false,
}: {
  title: string
  value: number
  currency?: boolean
}) {
  return (
    <div className="bg-white rounded shadow p-4 text-center">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-bold text-blue-600 mt-1">
        {currency ? `◎ ${value.toLocaleString()}` : value.toLocaleString()}
      </div>
    </div>
  )
}

function Pagination({
  page,
  setPage,
  total,
  perPage,
}: {
  page: number
  setPage: (n: number) => void
  total: number
  perPage: number
}) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center space-x-2 mt-4">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-2 text-sm">Page {page} of {totalPages}</span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}

