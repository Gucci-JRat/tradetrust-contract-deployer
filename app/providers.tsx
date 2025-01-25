"use client"

import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    sepolia,
    xdc,
    xdcTestnet
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { useRouter } from 'next/navigation';

import { http } from 'wagmi';
import { createPublicClient, webSocket, fallback } from 'viem';

const wsTransport = webSocket(
  `wss://eth-sepolia.g.alchemy.com/v2/4c6d1iDnk3rVgF05sP1cgMRExwfikAeg`,
  {
    retryCount: 3,
    timeout: 15000,
  }
);

const httpTransport = http(
  `https://eth-sepolia.g.alchemy.com/v2/4c6d1iDnk3rVgF05sP1cgMRExwfikAeg}`,
  {
    retryCount: 3,
    timeout: 15000,
  }
);

const config = getDefaultConfig({
    appName: 'TradeTrust Contract Deployer',
    projectId: 'TradeTrust Contract Deployer',
    chains: [
        xdc, 
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" 
            ? [xdcTestnet, sepolia] 
            : [])
    ],
    ssr: false,
    transports: {
        [xdc.id]: http(process.env.NEXT_PUBLIC_XDC_RPC_URL || "https://rpc.xdc.org"),
        [xdcTestnet.id]: http(process.env.NEXT_PUBLIC_XDC_TESTNET_RPC_URL || "https://erpc.apothem.network"),
        [sepolia.id]: fallback([wsTransport, httpTransport]),
    },
});

const queryClient = new QueryClient();

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const navigate = useRouter()

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider modalSize='compact'>
                        {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};