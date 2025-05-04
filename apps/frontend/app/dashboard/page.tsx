// ✅ 1. LIVE DATA SYNC + ✅ 2. CHART VISUALIZATION + ✅ 3. SESSION PERSISTENCE + ✅ 4. LOGOUT HANDLING

// apps/frontend/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'

interface Transaction {
  id: string
  amount: number
  type: 'credit' | 'debit'
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('session_token')
      if (!token) {
        router.push('/auth/email-entry')
        return
      }

      const res = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch transactions')
      const data = await res.json()
      setTransactions(data.transactions)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
    const interval = setInterval(fetchTransactions, 10000) // 🔁 Live update every 10s
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('session_token')
    router.push('/auth/email-entry')
  }

  const chartData = {
    labels: transactions.map((tx) => new Date(tx.createdAt).toLocaleTimeString()),
    datasets: [
      {
        label: 'Balance Over Time',
        data: transactions.reduce((acc, tx, i) => {
          const prev = acc[i - 1] || 0
          return [...acc, tx.type === 'credit' ? prev + tx.amount : prev - tx.amount]
        }, [] as number[]),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wallet Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="mb-6">
            <Line data={chartData} />
          </div>

          <h2 className="text-xl font-semibold mb-2">Recent Transactions</h2>
          <ul className="space-y-2">
            {transactions.map((tx) => (
              <li key={tx.id} className="border p-3 rounded shadow-sm">
                <p className="font-medium">
                  {tx.type === 'credit' ? '+' : '-'}{tx.amount} SFNC
                </p>
                <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

