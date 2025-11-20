import { useWallet } from '../hooks/useWallet';

export const WalletConnect = () => {
  const { address, balance, networkName, isConnected, isInstalled, loading, error, connect, disconnect } = useWallet();

  if (!isInstalled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">MetaMask Not Detected</h3>
        <p className="text-red-600 mb-4">Please install MetaMask to use this application.</p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Wallet Connection</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {!isConnected ? (
        <button
          onClick={connect}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Address</p>
            <p className="font-mono text-sm text-gray-800 break-all">{address}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Network</p>
            <p className="font-medium text-gray-800">{networkName}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Balance</p>
            <p className="font-medium text-gray-800">{balance ? `${parseFloat(balance).toFixed(4)} ETH` : 'Loading...'}</p>
          </div>

          <button
            onClick={disconnect}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};
