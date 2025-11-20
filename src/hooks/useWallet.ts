import { useState, useEffect, useCallback } from 'react';
import { JsonRpcSigner } from 'ethers';
import { connectWallet, getCurrentNetwork, getBalance, isMetaMaskInstalled } from '../utils/ethers';

interface WalletState {
  address: string | null;
  signer: JsonRpcSigner | null;
  chainId: string | null;
  networkName: string | null;
  balance: string | null;
  isConnected: boolean;
  isInstalled: boolean;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    signer: null,
    chainId: null,
    networkName: null,
    balance: null,
    isConnected: false,
    isInstalled: isMetaMaskInstalled(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { address, signer } = await connectWallet();
      const network = await getCurrentNetwork();
      const balance = await getBalance(address);

      setWalletState({
        address,
        signer,
        chainId: network.chainId,
        networkName: network.name,
        balance,
        isConnected: true,
        isInstalled: true,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Connect wallet error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletState({
      address: null,
      signer: null,
      chainId: null,
      networkName: null,
      balance: null,
      isConnected: false,
      isInstalled: isMetaMaskInstalled(),
    });
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!walletState.address) return;
    try {
      const balance = await getBalance(walletState.address);
      setWalletState(prev => ({ ...prev, balance }));
    } catch (err) {
      console.error('Refresh balance error:', err);
    }
  }, [walletState.address]);

  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== walletState.address) {
        connect();
      }
    };

    const handleChainChanged = () => {
      connect();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [connect, disconnect, walletState.address]);

  return {
    ...walletState,
    loading,
    error,
    connect,
    disconnect,
    refreshBalance,
  };
};
