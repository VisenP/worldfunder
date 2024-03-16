import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { mainnet, optimism } from "viem/chains";
import { createConfig, http, WagmiProvider } from "wagmi";

import App from "./App.tsx";

const queryClient = new QueryClient();

const config = createConfig(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getDefaultConfig({
        // Your dApps chains
        chains: [
            mainnet,
            {
                ...optimism,
                rpcUrls: {
                    default: {
                        http: [
                            "https://rpc.tenderly.co/fork/194b3ca2-bc57-448b-99cc-74bd75c3ba5e",
                        ],
                    },
                },
            },
        ],
        transports: {
            [optimism.id]: http(
                "https://rpc.tenderly.co/fork/194b3ca2-bc57-448b-99cc-74bd75c3ba5e"
            ),
            [mainnet.id]: http(),
        },
        // Required App Info
        appName: "Testapp",
    })
);

ReactDOM.createRoot(document.querySelector("#root")!).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider>
                    <App />
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>
);
