// pages/swap.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Swap() {
  const router = useRouter();
  const [fromCurrency, setFromCurrency] = useState('SFNL');
  const [toCurrency, setToCurrency] = useState('SFNC');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSwap = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/swifin/swap-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromCurrency, toCurrency, amount }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Swap Successful! Swapped ${amount} ${fromCurrency} to ${toCurrency}`);
        setAmount('');
      } else {
        throw new Error(data.error || 'Swap failed');
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Swap SFNL ⇆ SFNC</h1>
      <form onSubmit={handleSwap} className="w-full max-w-sm space-y-4">
        <div className="flex flex-col">
          <label>From:</label>
          <select
            className="input"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            <option value="SFNL">SFNL</option>
            <option value="SFNC">SFNC</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label>To:</label>
          <select
            className="input"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            <option value="SFNC">SFNC</option>
            <option value="SFNL">SFNL</option>
          </select>
        </div>

        <input
          className="input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to Swap"
          required
        />

        {message && <div className="text-center font-semibold">{message}</div>}

        <button type="submit" disabled={loading} className="btn w-full">
          {loading ? 'Swapping...' : 'Swap Tokens'}
        </button>
      </form>
    </div>
  );
}
