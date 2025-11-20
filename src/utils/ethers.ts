import { BrowserProvider, JsonRpcSigner, formatEther, parseEther } from 'ethers';

// 支持的网络配置
export const NETWORKS = {
  sepolia: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia',
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  mainnet: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
};

// 零地址
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// 获取 MetaMask Provider（优先使用 MetaMask）
export const getMetaMaskProvider = () => {
  if (typeof window === 'undefined' || !window.ethereum) return null;

  // 如果有多个钱包，尝试获取 MetaMask
  if (window.ethereum.providers) {
    return window.ethereum.providers.find((p: { isMetaMask?: boolean }) => p.isMetaMask) || null;
  }

  // 如果只有一个钱包且是 MetaMask
  if (window.ethereum.isMetaMask) {
    return window.ethereum;
  }

  return null;
};

// 检查 MetaMask 是否安装
export const isMetaMaskInstalled = (): boolean => {
  return getMetaMaskProvider() !== null;
};

// 获取 Provider
export const getProvider = (): BrowserProvider | null => {
  const provider = getMetaMaskProvider();
  if (!provider) return null;
  return new BrowserProvider(provider);
};

// 连接钱包
export const connectWallet = async (): Promise<{
  address: string;
  signer: JsonRpcSigner;
}> => {
  const metamaskProvider = getMetaMaskProvider();
  if (!metamaskProvider) throw new Error('MetaMask is not installed');

  try {
    // 直接使用 MetaMask provider 请求连接
    const accounts = await metamaskProvider.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask and try again.');
    }

    const provider = new BrowserProvider(metamaskProvider);
    const signer = await provider.getSigner();

    return {
      address: accounts[0],
      signer,
    };
  } catch (error: unknown) {
    // 处理常见错误
    const err = error as { code?: number; message?: string };
    if (err.code === 4001) {
      throw new Error('Connection request rejected. Please approve the connection in MetaMask.');
    } else if (err.code === -32603) {
      throw new Error('MetaMask internal error. Please refresh the page and try again.');
    } else if (err.message?.includes('circuit breaker')) {
      throw new Error('MetaMask is temporarily unavailable. Please wait a moment and try again.');
    }
    throw error;
  }
};

// 获取当前网络
export const getCurrentNetwork = async (): Promise<{
  chainId: string;
  name: string;
}> => {
  const provider = getProvider();
  if (!provider) throw new Error('MetaMask is not installed');

  const network = await provider.getNetwork();
  return {
    chainId: `0x${network.chainId.toString(16)}`,
    name: network.name,
  };
};

// 切换网络
export const switchNetwork = async (chainId: string): Promise<void> => {
  const metamaskProvider = getMetaMaskProvider();
  if (!metamaskProvider) throw new Error('MetaMask is not installed');

  try {
    await metamaskProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error: any) {
    // 如果网络不存在，尝试添加
    if (error.code === 4902) {
      const networkConfig = Object.values(NETWORKS).find(n => n.chainId === chainId);
      if (networkConfig) {
        await metamaskProvider.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
      }
    } else {
      throw error;
    }
  }
};

// 获取账户余额
export const getBalance = async (address: string): Promise<string> => {
  const provider = getProvider();
  if (!provider) throw new Error('MetaMask is not installed');

  const balance = await provider.getBalance(address);
  return formatEther(balance);
};

// 发送交易（支持添加 data 字段）
export const sendTransaction = async (
  signer: JsonRpcSigner,
  to: string,
  amount: string,
  data?: string
): Promise<string> => {
  const tx = await signer.sendTransaction({
    to,
    value: parseEther(amount),
    data: data || '0x',
  });

  return tx.hash;
};

// 文本转16进制
export const textToHex = (text: string): string => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// 16进制转文本
export const hexToText = (hex: string): string => {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const paddedHex = cleanHex.length % 2 ? '0' + cleanHex : cleanHex;
  const bytes = new Uint8Array(
    paddedHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  );
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
};

// 获取最新区块号
export const getBlockNumber = async (): Promise<number> => {
  const provider = getProvider();
  if (!provider) throw new Error('MetaMask is not installed');
  return await provider.getBlockNumber();
};

// 获取区块信息
export const getBlock = async (blockNumber: number) => {
  const provider = getProvider();
  if (!provider) throw new Error('MetaMask is not installed');
  return await provider.getBlock(blockNumber);
};

// 获取交易详情
export const getTransaction = async (txHash: string) => {
  const provider = getProvider();
  if (!provider) throw new Error('MetaMask is not installed');
  return await provider.getTransaction(txHash);
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
