import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { ProcessedData, DetailedRow } from '../types';
import { exportToCSV, exportToExcel } from '../utils/dataProcessor';

interface ResultsTableProps {
  data: ProcessedData[];
  detailedData: DetailedRow[];
  descriptionData?: DescriptionRow[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, detailedData, descriptionData }) => {
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

  const handleExcelExport = () => {
    exportToExcel(data, detailedData, descriptionData);
  };

  const totalAmount = data.reduce((sum, row) => sum + row.totalAmount, 0);
  const totalGrossWeight = data.reduce((sum, row) => sum + row.totalGrossWeight, 0);
  const totalNetWeight = data.reduce((sum, row) => sum + row.totalNetWeight, 0);
  const totalCartons = data.reduce((sum, row) => sum + row.totalCartons, 0);
  const totalLines = data.reduce((sum, row) => sum + row.lineCount, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExcelExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HS Code
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Invoice Amount
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Line Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={row.hsCode} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                    onClick={(e) => copyToClipboard(row.totalAmount.toFixed(2), e)}
                    className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150"
                    title="Click to copy Total Amount"
                  >
                    {row.totalAmount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <span 
                    onClick={(e) => copyToClipboard(row.totalGrossWeight.toFixed(2), e)}
                    className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150"
                    title="Click to copy Gross Weight"
                  >
                    {row.totalGrossWeight.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <span 
                    onClick={(e) => copyToClipboard(row.totalNetWeight.toFixed(2), e)}
                    className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150"
                    title="Click to copy Net Weight"
                  >
                    {row.totalNetWeight.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <span 
                    onClick={(e) => copyToClipboard(row.totalCartons, e)}
                    className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150"
                    title="Click to copy Cartons"
                  >
                    {row.totalCartons}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <span 
                    onClick={(e) => copyToClipboard(row.lineCount, e)}
                    className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-150"
                    title="Click to copy Line Count"
                  >
                    {row.lineCount}
                  </span>
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
                <span 
                  onClick={(e) => copyToClipboard(totalAmount.toFixed(2), e)}
                  className="cursor-pointer hover:bg-blue-200 px-2 py-1 rounded transition-colors duration-150"
                  title="Click to copy Total Amount"
                >
                  {totalAmount.toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900 text-right">
                <span 
                  onClick={(e) => copyToClipboard(totalGrossWeight.toFixed(2), e)}
                  className="cursor-pointer hover:bg-blue-200 px-2 py-1 rounded transition-colors duration-150"
                  title="Click to copy Total Gross Weight"
                >
                  {totalGrossWeight.toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900 text-right">
                <span 
                  onClick={(e) => copyToClipboard(totalNetWeight.toFixed(2), e)}
                  className="cursor-pointer hover:bg-blue-200 px-2 py-1 rounded transition-colors duration-150"
                  title="Click to copy Total Net Weight"
                >
                  {totalNetWeight.toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900 text-right">
                <span 
                  onClick={(e) => copyToClipboard(totalCartons, e)}
                  className="cursor-pointer hover:bg-blue-200 px-2 py-1 rounded transition-colors duration-150"
                  title="Click to copy Total Cartons"
                >
                  {totalCartons}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900 text-right">
                <span 
                  onClick={(e) => copyToClipboard(totalLines, e)}
                  className="cursor-pointer hover:bg-blue-200 px-2 py-1 rounded transition-colors duration-150"
                  title="Click to copy Total Lines"
                >
                  {totalLines}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};