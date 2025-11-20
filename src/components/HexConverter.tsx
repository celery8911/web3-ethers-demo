import { useState } from 'react';
import { textToHex, hexToText } from '../utils/ethers';

export const HexConverter = () => {
  const [textInput, setTextInput] = useState('');
  const [hexInput, setHexInput] = useState('');
  const [textToHexResult, setTextToHexResult] = useState('');
  const [hexToTextResult, setHexToTextResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleTextToHex = () => {
    setError(null);
    try {
      if (!textInput.trim()) {
        setTextToHexResult('');
        return;
      }
      const result = textToHex(textInput);
      setTextToHexResult(result);
    } catch (err) {
      setError('Failed to convert text to hex');
    }
  };

  const handleHexToText = () => {
    setError(null);
    try {
      if (!hexInput.trim()) {
        setHexToTextResult('');
        return;
      }
      const result = hexToText(hexInput);
      setHexToTextResult(result);
    } catch (err) {
      setError('Failed to convert hex to text. Please enter valid hexadecimal.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Hex Converter</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Text to Hex */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">Text → Hexadecimal</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Enter Text
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onBlur={handleTextToHex}
              onKeyUp={handleTextToHex}
              placeholder="Enter text to convert..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {textToHexResult && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Hexadecimal Output
                <span className="ml-2 text-xs text-gray-500">
                  ({(textToHexResult.length - 2) / 2} bytes)
                </span>
              </label>
              <div className="relative">
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 font-mono text-sm break-all">
                  {textToHexResult}
                </div>
                <button
                  onClick={() => copyToClipboard(textToHexResult)}
                  className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      {/* Hex to Text */}
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-3">Hexadecimal → Text</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Enter Hexadecimal (with or without 0x prefix)
            </label>
            <textarea
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onBlur={handleHexToText}
              onKeyUp={handleHexToText}
              placeholder="0x48656c6c6f"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
              rows={3}
            />
          </div>

          {hexToTextResult && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Text Output
                <span className="ml-2 text-xs text-gray-500">
                  ({hexToTextResult.length} characters)
                </span>
              </label>
              <div className="relative">
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm break-all">
                  {hexToTextResult}
                </div>
                <button
                  onClick={() => copyToClipboard(hexToTextResult)}
                  className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-blue-800 text-sm">
          💡 Tip: You can use the hex output as transaction data when sending ETH.
        </p>
      </div>
    </div>
  );
};
