import { WalletConnect } from './components/WalletConnect';
import { NetworkSwitch } from './components/NetworkSwitch';
import { HexConverter } from './components/HexConverter';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Web3 Ethers.js Demo
          </h1>
          <p className="text-gray-600">
            MetaMask Integration • Sepolia Testnet • Ethers.js v6
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <WalletConnect />
          <NetworkSwitch />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <HexConverter />
        </div>
      </div>
    </div>
  );
}

export default App;
