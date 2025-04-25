import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { polygonMumbai } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'Swifin Wallet',
  projectId: 'YOUR_PROJECT_ID', // From WalletConnect Cloud (can be dummy for now)
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
        <RainbowKitProvider chains={[polygonMumbai]}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
