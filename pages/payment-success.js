// pages/payment-success.js
import Link from 'next/link';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
      <p className="mb-6">Thank you for purchasing SFNC. Your transaction has been completed successfully.</p>
      <Link href="/dashboard" className="btn">
        Go to Dashboard
      </Link>
    </div>
  );
}
