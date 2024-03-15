import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createConfig, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { sepolia } from 'viem/chains';


const queryClient = new QueryClient();

const config = createConfig(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    getDefaultConfig({
        // Your dApps chains
        chains: [sepolia],
        // Required App Info
        appName: "Testapp",

    }),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
              <ConnectKitProvider><App /></ConnectKitProvider>
          </QueryClientProvider>
      </WagmiProvider>
  </React.StrictMode>,
)
