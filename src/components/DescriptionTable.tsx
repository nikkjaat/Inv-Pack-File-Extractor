import React, { useState } from 'react';
import { Copy, Check, Download, FileSpreadsheet } from 'lucide-react';
import { DescriptionRow } from '../types';
import { exportDescriptionToCSV, exportDescriptionToExcel } from '../utils/dataProcessor';

interface DescriptionTableProps {
  data: DescriptionRow[];
  fileName: string;
  showExportOptions?: boolean;
}

export const DescriptionTable: React.FC<DescriptionTableProps> = ({ 
  data, 
  fileName, 
  showExportOptions = false 
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExportCSV = () => {
    const csvContent = exportDescriptionToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoice-descriptions.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    exportDescriptionToExcel(data);
  };
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Description Data</h2>
          <p className="text-sm text-gray-600 mt-1">
            Extracted from Column A (rows 12 onwards) from {fileName}
          </p>
        </div>
        {showExportOptions && (
          <div className="flex space-x-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Row #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={`${row.rowNumber}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {row.rowNumber}
                </td>
                <td 
                  className="px-6 py-4 text-sm text-gray-900 cursor-pointer hover:bg-blue-50 transition-colors duration-150 rounded"
                  onClick={() => copyToClipboard(row.description, index)}
                  title="Click to copy description"
                >
                  <span className="select-text">
                    {row.description}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => copyToClipboard(row.description, index)}
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      copiedIndex === index
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-800 border border-gray-200'
                    }`}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Total descriptions found: {data.length} | Click on any description text or use the copy button to copy to clipboard
        </p>
      </div>
    </div>
  );
};