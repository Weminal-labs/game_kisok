import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { ConnectButton, 
  SuiClientProvider, 
  createNetworkConfig,
  useCurrentAccount,
  useCurrentWallet,
  useSignAndExecuteTransactionBlock
} from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '@mysten/dapp-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import './App.css'
import SignButton from './components/Footer';
import { KioskClient, KioskTransaction, Network } from '@mysten/kiosk';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import Home from './components/Home';
import React from 'react';
import Footer from './components/Footer';
function App() {
  //sign
  const { networkConfig, useNetworkVariable } = createNetworkConfig({
    testnet: {
      url: getFullnodeUrl('testnet'),
      variables: {
        myMovePackageId: '0x123',
      }
    },
    mainnet: {
      url: getFullnodeUrl('mainnet'),
      variables: {
        myMovePackageId: '0x456',
      }
    },
  });
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork='testnet'>
      <WalletProvider>
          <Home />
          <Footer />
      </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}

export default App
