import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { switchNetwork, NETWORKS } from '../utils/ethers';

export const NetworkSwitch = () => {
  const { chainId, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwitchNetwork = async (targetChainId: string) => {
    setLoading(true);
    setError(null);
    try {
      await switchNetwork(targetChainId);
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Network Switch</h2>
        <p className="text-gray-600">Please connect your wallet first.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Network Switch</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(NETWORKS).map(([key, network]) => {
          const isCurrentNetwork = chainId === network.chainId;
          return (
            <button
              key={key}
              onClick={() => handleSwitchNetwork(network.chainId)}
              disabled={loading || isCurrentNetwork}
              className={`w-full px-4 py-3 rounded-lg font-medium transition ${
                isCurrentNetwork
                  ? 'bg-green-100 text-green-800 border-2 border-green-500'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
              } disabled:cursor-not-allowed`}
            >
              {isCurrentNetwork && '✓ '}
              {network.chainName}
              {isCurrentNetwork && ' (Current)'}
            </button>
          );
        })}
      </div>
    </div>
  );
};
