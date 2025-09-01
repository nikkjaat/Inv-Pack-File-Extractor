import React from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { ProcessedData } from '../types';
import { exportToCSV } from '../utils/dataProcessor';

interface ResultsTableProps {
  data: ProcessedData[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  const [copiedValue, setCopiedValue] = React.useState<string | null>(null);

  const copyToClipboard = async (value: string | number) => {
    try {
      await navigator.clipboard.writeText(value.toString());
      setCopiedValue(value.toString());
      setTimeout(() => setCopiedValue(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExport = () => {
    const csvContent = exportToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hs-code-analysis.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const totalAmount = data.reduce((sum, row) => sum + row.totalAmount, 0);
  const totalGrossWeight = data.reduce((sum, row) => sum + row.totalGrossWeight, 0);
  const totalNetWeight = data.reduce((sum, row) => sum + row.totalNetWeight, 0);
  const totalCartons = data.reduce((sum, row) => sum + row.totalCartons, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HS Code
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Gross Weight
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Net Weight
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Cartons
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={row.hsCode} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center space-x-2">
                    <span>{row.hsCode}</span>
                    <button
                      onClick={() => copyToClipboard(row.hsCode)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                      title="Copy HS Code"
                    >
                      {copiedValue === row.hsCode ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span>{row.totalAmount.toFixed(2)}</span>
                    <button
                      onClick={() => copyToClipboard(row.totalAmount.toFixed(2))}
                      className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                      title="Copy Total Amount"
                    >
                      {copiedValue === row.totalAmount.toFixed(2) ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span>{row.totalGrossWeight.toFixed(2)}</span>
                    <button
                      onClick={() => copyToClipboard(row.totalGrossWeight.toFixed(2))}
                      className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                      title="Copy Gross Weight"
                    >
                      {copiedValue === row.totalGrossWeight.toFixed(2) ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span>{row.totalNetWeight.toFixed(2)}</span>
                    <button
                      onClick={() => copyToClipboard(row.totalNetWeight.toFixed(2))}
                      className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                      title="Copy Net Weight"
                    >
                      {copiedValue === row.totalNetWeight.toFixed(2) ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span>{row.totalCartons}</span>
                    <button
                      onClick={() => copyToClipboard(row.totalCartons)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                      title="Copy Cartons"
                    >
                      {copiedValue === row.totalCartons.toString() ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-blue-50 border-t-2 border-blue-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                TOTAL
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span>{totalAmount.toFixed(2)}</span>
                  <button
                    onClick={() => copyToClipboard(totalAmount.toFixed(2))}
                    className="p-1 hover:bg-blue-200 rounded transition-colors duration-150"
                    title="Copy Total Amount"
                  >
                    {copiedValue === totalAmount.toFixed(2) ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-blue-400" />
                    )}
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span>{totalGrossWeight.toFixed(2)}</span>
                  <button
                    onClick={() => copyToClipboard(totalGrossWeight.toFixed(2))}
                    className="p-1 hover:bg-blue-200 rounded transition-colors duration-150"
                    title="Copy Total Gross Weight"
                  >
                    {copiedValue === totalGrossWeight.toFixed(2) ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-blue-400" />
                    )}
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span>{totalNetWeight.toFixed(2)}</span>
                  <button
                    onClick={() => copyToClipboard(totalNetWeight.toFixed(2))}
                    className="p-1 hover:bg-blue-200 rounded transition-colors duration-150"
                    title="Copy Total Net Weight"
                  >
                    {copiedValue === totalNetWeight.toFixed(2) ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-blue-400" />
                    )}
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span>{totalCartons}</span>
                  <button
                    onClick={() => copyToClipboard(totalCartons)}
                    className="p-1 hover:bg-blue-200 rounded transition-colors duration-150"
                    title="Copy Total Cartons"
                  >
                    {copiedValue === totalCartons.toString() ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-blue-400" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};