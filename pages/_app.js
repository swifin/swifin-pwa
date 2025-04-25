// pages/_app.js
import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

import Head from 'next/head';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { polygonMumbai } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'Swifin Wallet',
  projectId: 'swifin-app',
  chains: [polygonMumbai],
  transports: {
    [polygonMumbai.id]: http(),
  },
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

<Head>
  <title>Swifin Wallet - Empowering Inclusive Prosperity</title>
  <meta name="description" content="Activate your Swifin Wallet and join the global movement for economic transformation." />
  <meta property="og:title" content="Swifin Wallet" />
  <meta property="og:description" content="Activate your Swifin Wallet and join the global movement." />
  <meta property="og:image" content="/swifin-og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
</Head>

export default MyApp;

