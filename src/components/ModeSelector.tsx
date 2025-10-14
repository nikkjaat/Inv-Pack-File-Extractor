import React from 'react';
import { FileSpreadsheet, FileText, BarChart3 } from 'lucide-react';

interface ModeSelectorProps {
  selectedMode: 'full' | 'description';
  onModeChange: (mode: 'full' | 'description') => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onModeChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FileSpreadsheet className="w-5 h-5 mr-2" />
        Choose Analysis Mode
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => onModeChange('full')}
          className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
            selectedMode === 'full'
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <BarChart3 className={`w-6 h-6 ${selectedMode === 'full' ? 'text-blue-600' : 'text-gray-500'}`} />
            <h3 className={`text-lg font-semibold ${selectedMode === 'full' ? 'text-blue-900' : 'text-gray-700'}`}>
              Full Analysis
            </h3>
          </div>
          <p className={`text-sm ${selectedMode === 'full' ? 'text-blue-700' : 'text-gray-600'}`}>
            Upload both invoice and packing list files to get complete analysis with HS code summaries, 
            weights, cartons, and description data with export options.
          </p>
          <div className="mt-3 text-xs text-gray-500">
            <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">Invoice File</span>
            <span className="inline-block bg-gray-100 px-2 py-1 rounded">Packing List File</span>
          </div>
        </button>

        <button
          onClick={() => onModeChange('description')}
          className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
            selectedMode === 'description'
              ? 'border-green-500 bg-green-50 shadow-md'
              : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <FileText className={`w-6 h-6 ${selectedMode === 'description' ? 'text-green-600' : 'text-gray-500'}`} />
            <h3 className={`text-lg font-semibold ${selectedMode === 'description' ? 'text-green-900' : 'text-gray-700'}`}>
              Description Only
            </h3>
          </div>
          <p className={`text-sm ${selectedMode === 'description' ? 'text-green-700' : 'text-gray-600'}`}>
            Upload only the invoice file to extract description data from Column A (starting row 12) 
            with export options. Quick and simple.
          </p>
          <div className="mt-3 text-xs text-gray-500">
            <span className="inline-block bg-gray-100 px-2 py-1 rounded">Invoice File Only</span>
          </div>
        </button>
      </div>
    </div>
  );
};