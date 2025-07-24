
import React from 'react';
import { HistoryCheckpoint } from '../types';

interface HistoryPanelProps {
  history: HistoryCheckpoint[];
  currentIndex: number;
  onRevert: (index: number) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, currentIndex, onRevert }) => {
  if (!history || history.length === 0) {
    return (
      <div>
        <h3 className="block text-sm font-medium text-gray-700 mb-2">Version History</h3>
        <p className="text-sm text-gray-500">No versions available.</p>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Version History
      </label>
      <div className="border border-gray-200 rounded-lg bg-white max-h-40 overflow-y-auto">
        <ul className="divide-y divide-gray-200">
          {history.map((checkpoint, index) => (
            <li
              key={checkpoint.timestamp.toISOString()}
              className={`p-2 flex items-center justify-between transition-colors ${
                index === currentIndex ? 'bg-[#e6f4f1]' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex-grow overflow-hidden mr-2">
                <p className={`text-sm font-medium truncate ${index === currentIndex ? 'text-[#005f79]' : 'text-gray-800'}`} title={checkpoint.name}>
                  {checkpoint.name}
                </p>
                <p className="text-xs text-gray-500">
                  {checkpoint.timestamp.toLocaleTimeString()} - {checkpoint.items.length} items
                </p>
              </div>
              <button
                onClick={() => onRevert(index)}
                disabled={index === currentIndex}
                className="ml-2 flex-shrink-0 px-3 py-1 text-xs font-semibold text-white bg-[#005f79] rounded-md shadow-sm hover:bg-[#003d4f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {index === currentIndex ? 'Active' : 'Restore'}
              </button>
            </li>
          ))}
        </ul>
      </div>
       <p className="mt-1 text-xs text-gray-500">Review and restore previous data versions.</p>
    </div>
  );
};

export default HistoryPanel;
