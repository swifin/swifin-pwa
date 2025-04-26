// pages/payment-cancel.js
import Link from 'next/link';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Canceled</h1>
      <p className="mb-6">It looks like you canceled your payment. You can try again at any time.</p>
      <Link href="/buy-sfnc" className="btn">
        Try Again
      </Link>
    </div>
  );
}
