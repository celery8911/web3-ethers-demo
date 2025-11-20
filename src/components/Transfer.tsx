import { useState } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { sendTransaction, ZERO_ADDRESS } from '../utils/ethers';
import { isAddress } from 'ethers';

export const Transfer = () => {
  const { signer, isConnected, chainId, refreshBalance } = useWalletContext();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [data, setData] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !amount || !toAddress) return;

    // 验证地址
    if (!isAddress(toAddress)) {
      setError('Invalid Ethereum address');
      return;
    }

    // 验证 data 字段（如果提供）
    if (data && !data.startsWith('0x')) {
      setError('Data field must start with 0x');
      return;
    }

    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const hash = await sendTransaction(signer, toAddress, amount, data || undefined);
      setTxHash(hash);
      setAmount('');
      setData('');
      setTimeout(() => refreshBalance(), 2000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const fillZeroAddress = () => {
    setToAddress(ZERO_ADDRESS);
  };

  const getExplorerUrl = () => {
    if (chainId === '0xaa36a7') {
      return 'https://sepolia.etherscan.io';
    }
    return 'https://etherscan.io';
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Send Transaction</h2>
        <p className="text-gray-600">Please connect your wallet first.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Send Transaction</h2>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              required
            />
            <button
              type="button"
              onClick={fillZeroAddress}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium whitespace-nowrap"
            >
              0x0...000
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (ETH)
          </label>
          <input
            type="number"
            step="0.0001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data (Optional - Hex format)
          </label>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="0x... (paste hex from converter above)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Use the Hex Converter above to convert text to hex, then paste here
          </p>
        </div>

        {toAddress === ZERO_ADDRESS && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ You are sending to the zero address. Funds will be burned permanently!
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {txHash && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm mb-2">Transaction sent successfully!</p>
            <a
              href={`${getExplorerUrl()}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm font-mono break-all"
            >
              View on Explorer: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !amount || !toAddress}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
        >
          {loading ? 'Sending...' : 'Send Transaction'}
        </button>
      </form>
    </div>
  );
};
