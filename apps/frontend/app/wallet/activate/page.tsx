// File: apps/frontend/app/wallet/activate/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { activateWallet, getWalletSummary } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function WalletActivatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activated, setActivated] = useState(false)
  const [summary, setSummary] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getWalletSummary().then((data) => {
      if (data.walletActivated) setActivated(true)
      setSummary(data)
    }).catch(() => setError('Failed to load summary'))
  }, [])

  const handleActivate = async () => {
    setLoading(true)
    try {
      await activateWallet()
      setActivated(true)
      const updated = await getWalletSummary()
      setSummary(updated)
    } catch (err) {
      setError('Activation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Swifin Wallet Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      {activated ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow text-center">
              <h2 className="text-gray-600">SFNC Balance</h2>
              <p className="text-2xl font-semibold">{summary?.wallet?.sfncBalance}</p>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <h2 className="text-gray-600">SFNL Balance</h2>
              <p className="text-2xl font-semibold">{summary?.wallet?.sfnlBalance}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-2">Recent Transactions</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {summary?.recentTransactions?.map((tx: any) => (
                  <tr key={tx.id} className="border-b">
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="capitalize">{tx.type}</td>
                    <td>{tx.amountSfnc}</td>
                    <td className="capitalize text-green-600">{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-2">Transaction Activity Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="mb-4">Your wallet is not activated.</p>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleActivate}
            disabled={loading}
          >
            {loading ? 'Activating...' : 'Activate Wallet'}
          </button>
        </div>
      )}
    </div>
  )
}

