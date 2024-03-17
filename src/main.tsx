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
                            "https://rpc.tenderly.co/fork/aa8bb823-857e-43ed-80bb-b63fcee5311f",
                        ],
                    },
                },
            },
        ],
        transports: {
            [optimism.id]: http(
                "https://rpc.tenderly.co/fork/aa8bb823-857e-43ed-80bb-b63fcee5311f"
            ),
            [mainnet.id]: http(),
        },

        walletConnectProjectId: "b48c8470ff7f2dd5d7361057ba6dc160",

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
