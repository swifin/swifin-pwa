// apps/frontend/app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="text-center py-16">
      <h2 className="text-4xl font-bold mb-6">Empowering Global Financial Inclusion</h2>
      <p className="text-lg text-gray-600 max-w-xl mx-auto">
        Swifin connects individuals, businesses, and governments to a unified digital platform for seamless value exchange and inclusive prosperity.
      </p>
      <div className="mt-10">
        <Link href="/marketplace">
          <button className="mt-6 inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition">
            🌐 Explore Marketplace
          </button>
        </Link>
      </div>
    </div>
  )
}

