import { useState } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { getBlockNumber, getBlock, getTransaction } from '../utils/ethers';

export const ChainDataReader = () => {
  const { isConnected, address } = useWalletContext();
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [blockData, setBlockData] = useState<any>(null);
  const [txHash, setTxHash] = useState('');
  const [txData, setTxData] = useState<any>(null);
  const [loadingBlockNumber, setLoadingBlockNumber] = useState(false);
  const [loadingBlock, setLoadingBlock] = useState(false);
  const [loadingTx, setLoadingTx] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetBlockNumber = async () => {
    setLoadingBlockNumber(true);
    setError(null);
    try {
      const number = await getBlockNumber();
      setBlockNumber(number);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to get block number');
    } finally {
      setLoadingBlockNumber(false);
    }
  };

  const handleGetBlock = async () => {
    if (!blockNumber) return;
    setLoadingBlock(true);
    setError(null);
    try {
      const block = await getBlock(blockNumber);
      setBlockData(block);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to get block data');
    } finally {
      setLoadingBlock(false);
    }
  };

  const handleGetTransaction = async () => {
    if (!txHash) return;
    setLoadingTx(true);
    setError(null);
    setTxData(null);
    try {
      const tx = await getTransaction(txHash);
      setTxData(tx);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to get transaction data');
    } finally {
      setLoadingTx(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Chain Data Reader</h2>
        <p className="text-gray-600">Please connect your wallet first.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Chain Data Reader</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Account Balance */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Your Account</h3>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-mono text-sm text-gray-800 break-all">{address}</p>
          </div>
        </div>

        {/* Latest Block Number */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Latest Block</h3>
          <button
            onClick={handleGetBlockNumber}
            disabled={loadingBlockNumber}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-sm font-medium"
          >
            {loadingBlockNumber ? 'Loading...' : 'Get Latest Block Number'}
          </button>
          {blockNumber !== null && (
            <div className="mt-3 bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Block Number</p>
              <p className="font-mono text-lg text-gray-800">{blockNumber.toLocaleString()}</p>
              <button
                onClick={handleGetBlock}
                disabled={loadingBlock}
                className="mt-2 w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition text-sm"
              >
                {loadingBlock ? 'Loading...' : 'Get Block Details'}
              </button>
            </div>
          )}
        </div>

        {/* Block Details */}
        {blockData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Block Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Hash: </span>
                <span className="font-mono text-gray-800 break-all">{blockData.hash}</span>
              </div>
              <div>
                <span className="text-gray-600">Timestamp: </span>
                <span className="text-gray-800">{new Date(blockData.timestamp * 1000).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Transactions: </span>
                <span className="text-gray-800">{blockData.transactions?.length || 0}</span>
              </div>
              <div>
                <span className="text-gray-600">Miner: </span>
                <span className="font-mono text-gray-800 break-all">{blockData.miner}</span>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Lookup */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Transaction Lookup</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x... (transaction hash)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <button
              onClick={handleGetTransaction}
              disabled={loadingTx || !txHash}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-sm font-medium"
            >
              {loadingTx ? 'Loading...' : 'Get Transaction'}
            </button>
          </div>
        </div>

        {/* Transaction Details */}
        {txData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Transaction Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">From: </span>
                <span className="font-mono text-gray-800 break-all">{txData.from}</span>
              </div>
              <div>
                <span className="text-gray-600">To: </span>
                <span className="font-mono text-gray-800 break-all">{txData.to || 'Contract Creation'}</span>
              </div>
              <div>
                <span className="text-gray-600">Value: </span>
                <span className="text-gray-800">{(Number(txData.value) / 1e18).toFixed(6)} ETH</span>
              </div>
              <div>
                <span className="text-gray-600">Block: </span>
                <span className="text-gray-800">{txData.blockNumber}</span>
              </div>
              {txData.data && txData.data !== '0x' && (
                <div>
                  <span className="text-gray-600">Data: </span>
                  <span className="font-mono text-gray-800 break-all text-xs">{txData.data}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
