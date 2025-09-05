import React from 'react';
import { Copy, Check } from 'lucide-react';
import { DetailedRow } from '../types';

interface DetailedTableProps {
  data: DetailedRow[];
}

export const DetailedTable: React.FC<DetailedTableProps> = ({ data }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Line by Line Details</h2>
        <p className="text-sm text-gray-600 mt-1">
          Detailed breakdown showing each matched line from both files
        </p>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Line #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HS Code
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gross Weight
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Weight
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cartons
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={`${row.lineNumber}-${row.hsCode}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.lineNumber}
                </td>
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
                    <span>{row.invoiceAmount.toFixed(2)}</span>
                    <button
                      onClick={() => copyToClipboard(row.invoiceAmount.toFixed(2))}
                      className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                      title="Copy Invoice Amount"
                    >
                      {copiedValue === row.invoiceAmount.toFixed(2) ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span>{row.grossWeight.toFixed(2)}</span>
                    <button
                      onClick={() => copyToClipboard(row.grossWeight.toFixed(2))}
                      className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                      title="Copy Gross Weight"
                    >
                      {copiedValue === row.grossWeight.toFixed(2) ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span>{row.netWeight.toFixed(2)}</span>
                    <button
                      onClick={() => copyToClipboard(row.netWeight.toFixed(2))}
                      className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                      title="Copy Net Weight"
                    >
                      {copiedValue === row.netWeight.toFixed(2) ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span>{row.cartons}</span>
                    <button
                      onClick={() => copyToClipboard(row.cartons)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                      title="Copy Cartons"
                    >
                      {copiedValue === row.cartons.toString() ? (
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
        </table>
      </div>
    </div>
  );
};