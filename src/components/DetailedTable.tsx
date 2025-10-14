import React from 'react';
import { DetailedRow } from '../types';

interface DetailedTableProps {
  data: DetailedRow[];
}

export const DetailedTable: React.FC<DetailedTableProps> = ({ data }) => {
  const copyToClipboard = async (value: string | number, event: React.MouseEvent) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(value.toString());
      // Show brief visual feedback
      const target = event.currentTarget as HTMLElement;
      const originalBg = target.style.backgroundColor;
      target.style.backgroundColor = '#10b981';
      target.style.color = 'white';
      setTimeout(() => {
        target.style.backgroundColor = originalBg;
        target.style.color = '';
      }, 200);
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
                  <span 
                    onClick={(e) => copyToClipboard(row.hsCode, e)}
                    className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150"
                    title="Click to copy HS Code"
                  >
                    {row.hsCode}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <span 
                    onClick={(e) => copyToClipboard(row.invoiceAmount.toFixed(2), e)}
                    className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150"
                    title="Click to copy Invoice Amount"
                  >
                    {row.invoiceAmount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <span 
                    onClick={(e) => copyToClipboard(row.grossWeight.toFixed(2), e)}
                    className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150"
                    title="Click to copy Gross Weight"
                  >
                    {row.grossWeight.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <span 
                    onClick={(e) => copyToClipboard(row.netWeight.toFixed(2), e)}
                    className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150"
                    title="Click to copy Net Weight"
                  >
                    {row.netWeight.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <span 
                    onClick={(e) => copyToClipboard(row.cartons, e)}
                    className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150"
                    title="Click to copy Cartons"
                  >
                    {row.cartons}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};