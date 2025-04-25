// pages/index.js
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Head from 'next/head';
import Image from 'next/image';

//import dashboardImage from '../public/dashboard-preview.png';

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-white p-6">
      <Head>
        <title>Swifin Wallet</title>
        <meta name="description" content="Swifin SFNC/SFNL Wallet Dashboard" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Swifin Wallet</h1>
          <ConnectButton />
        </div>

        <div className="bg-gray-100 rounded-lg p-6 shadow">
          <img
               src="/dashboard-preview.png"
               alt="Swifin Dashboard Preview"
               className="rounded w-full"
           />
		   
        </div>

        {isConnected && (
          <p className="mt-4 text-green-600">Connected: {address}</p>
        )}
      </div>
    </div>
  );
}
