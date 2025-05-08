import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <h1 className="mb-4 text-center text-3xl font-bold">
        Empowering Global Financial Inclusion
      </h1>

      <p className="mb-8 text-center">
        Swifin connects individuals, businesses, and governments to a unified digital platform
        for seamless value exchange and inclusive prosperity.
      </p>

      <div className="text-center">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 rounded border px-4 py-2 hover:bg-gray-100 transition"
        >
          <span role="img" aria-label="globe">🌐</span>
          Explore Marketplace
        </Link>
      </div>
    </>
  )
}

