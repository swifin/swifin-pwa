import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Head from 'next/head';

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Head>
        <title>Swifin Wallet</title>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <h1 className="text-2xl font-bold mb-4">Swifin SFNC/SFNL Wallet</h1>
      <ConnectButton />
      {isConnected && (
        <p className="mt-4 text-green-700">Connected as: {address}</p>
      )}
    </div>
  );
}
