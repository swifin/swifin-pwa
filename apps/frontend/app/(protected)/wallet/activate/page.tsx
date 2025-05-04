'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { activateWallet, getWalletSummary } from '@/lib/api'

export default function WalletActivatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activated, setActivated] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState<{
    balances: { sfnc: number; sfnl: number }
    transactions: Record<string, number>
  } | null>(null)

  const swifinId =
    typeof window !== 'undefined' ? localStorage.getItem('swifin_id') || '' : ''

  const handleActivate = async () => {
    if (!swifinId) {
      setError('Swifin ID not found.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await activateWallet(swifinId)
      if (res.success) {
        setActivated(true)
        fetchSummary()
      } else {
        setError('Activation failed.')
      }
    } catch (err) {
      console.error(err)
      setError('Activation failed.')
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    if (!swifinId) return
    try {
      const res = await getWalletSummary(swifinId)
      setSummary(res)
    } catch (err) {
      console.error('Failed to fetch summary:', err)
    }
  }

  useEffect(() => {
    if (swifinId) fetchSummary()
  }, [swifinId])

  const chartData =
    summary?.transactions
      ? Object.entries(summary.transactions).map(([type, value]) => ({
          type,
          value,
        }))
      : []

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Activate Wallet</h1>

      {!activated ? (
        <>
          <button
            onClick={handleActivate}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Activating...' : 'Activate Wallet'}
          </button>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </>
      ) : (
        <p className="text-green-600 font-semibold">Wallet activated successfully!</p>
      )}

      {summary && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Balance Summary</h2>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-green-100 border border-green-400 rounded text-center">
              <p className="text-sm text-green-700">SFNC Balance</p>
              <p className="text-2xl font-bold text-green-800">{summary.balances.sfnc}</p>
            </div>
            <div className="p-4 bg-yellow-100 border border-yellow-400 rounded text-center">
              <p className="text-sm text-yellow-700">SFNL Balance</p>
              <p className="text-2xl font-bold text-yellow-800">{summary.balances.sfnl}</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2">Transaction Summary</h2>
          <div className="h-64 bg-gray-50 p-4 border rounded">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <table className="mt-6 w-full text-left border rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="p-3 border-b">Transaction Type</th>
                <th className="p-3 border-b">Total Amount (SFNC)</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item) => (
                <tr key={item.type} className="hover:bg-gray-50">
                  <td className="p-3 border-b capitalize">{item.type}</td>
                  <td className="p-3 border-b font-medium">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

