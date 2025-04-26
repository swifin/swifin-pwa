// pages/buy-sfnc.js
import { useState } from 'react';

export default function BuySFNC() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentLink('');

    try {
      const res = await fetch('/api/payments/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, paymentMethod }),
      });

      const data = await res.json();

      if (res.ok && data.paymentUrl) {
        setPaymentLink(data.paymentUrl);
      } else {
        alert(data.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred during payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Buy SFNC</h1>

      <form className="space-y-6 max-w-lg" onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount in USD"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="input"
        />

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          required
          className="input"
        >
          <option value="">Select Payment Method</option>
          <option value="stripe">Stripe (Credit/Debit Card)</option>
          <option value="flutterwave">Flutterwave</option>
          <option value="paypal">PayPal</option>
          <option value="coinbase">Coinbase (Crypto)</option>
          <option value="coinpayments">CoinPayments (Crypto)</option>
        </select>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Processing...' : 'Generate Payment Link'}
        </button>
      </form>

      {paymentLink && (
        <div className="mt-8">
          <a href={paymentLink} className="btn" target="_blank" rel="noopener noreferrer">
            Proceed to Payment
          </a>
        </div>
      )}
    </div>
  );
}
