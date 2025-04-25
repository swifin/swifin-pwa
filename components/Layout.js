// components/Layout.js
import Head from 'next/head';

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title || 'Swifin Wallet'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-gray-50 text-gray-800">{children}</main>
    </>
  );
}
