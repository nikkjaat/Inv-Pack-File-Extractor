import React, { useState, useEffect } from 'react';
import { X, FileSpreadsheet, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { getFilePreview } from '../utils/excelParser';

interface FilePreviewProps {
  file: File;
  fileType: 'invoice' | 'packingList';
  onClose: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, fileType, onClose }) => {
  const [preview, setPreview] = useState<{
    headers: string[];
    sampleRows: any[][];
    totalRows: number;
    dataStartRow: number;
    columnInfo: { [key: number]: { hasData: boolean; sampleValues: string[] } };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPreview = async () => {
      try {
        setLoading(true);
        const previewData = await getFilePreview(file);
        setPreview(previewData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [file]);

  const getImportantColumns = () => {
    if (fileType === 'invoice') {
      return [5, 14, 15]; // F, O, P
    } else {
      return [5, 7, 11, 12]; // F, H, L, M
    }
  };

  const getColumnLabel = (index: number) => {
    return String.fromCharCode(65 + index); // Convert 0->A, 1->B, etc.
  };

  const isImportantColumn = (index: number) => {
    return getImportantColumns().includes(index);
  };

  const getColumnStatus = (index: number) => {
    if (!preview?.columnInfo[index]) return 'empty';
    const { hasData } = preview.columnInfo[index];
    const isImportant = isImportantColumn(index);
    
    if (isImportant && hasData) return 'important-with-data';
    if (isImportant && !hasData) return 'important-no-data';
    if (hasData) return 'has-data';
    return 'empty';
  };

  const getColumnClass = (status: string) => {
    switch (status) {
      case 'important-with-data':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'important-no-data':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'has-data':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getDataSummary = () => {
    if (!preview) return null;
    
    const importantCols = getImportantColumns();
    const summary = importantCols.map(colIndex => {
      const columnInfo = preview.columnInfo[colIndex];
      const label = getColumnLabel(colIndex);
      const hasData = columnInfo?.hasData || false;
      const sampleValues = columnInfo?.sampleValues || [];
      
      let description = '';
      if (fileType === 'invoice') {
        if (colIndex === 5) description = 'HS Codes';
        else if (colIndex === 14) description = 'Amounts (Column O)';
        else if (colIndex === 15) description = 'Amounts (Column P)';
      } else {
        if (colIndex === 5) description = 'HS Codes';
        else if (colIndex === 7) description = 'Cartons';
        else if (colIndex === 11) description = 'Net Weight';
        else if (colIndex === 12) description = 'Gross Weight';
      }
      
      return { label, description, hasData, sampleValues };
    });
    
    return summary;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">File Preview & Validation</h3>
              <p className="text-sm text-gray-600">{file.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading preview...</span>
            </div>
          ) : error ? (
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : preview ? (
            <div className="space-y-6">
              {/* Data Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Data Validation Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getDataSummary()?.map((col, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      col.hasData ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">Column {col.label}</span>
                        {col.hasData ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{col.description}</p>
                      {col.hasData ? (
                        <div className="text-xs text-green-700">
                          <p>✓ Data found</p>
                          {col.sampleValues.length > 0 && (
                            <p className="mt-1">Sample: {col.sampleValues.slice(0, 2).join(', ')}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-red-700">✗ No data found</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* File Info */}
              <div className="flex items-center justify-between text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <span>Total rows: {preview.totalRows} | Data starts at row: {preview.dataStartRow + 1}</span>
                <span>Showing first 10 data rows</span>
              </div>
              
              {/* Table Preview */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-12">
                        Row
                      </th>
                      {preview.headers.slice(0, 20).map((header, index) => {
                        const status = getColumnStatus(index);
                        return (
                          <th
                            key={index}
                            className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider border-r border-gray-200 min-w-24 ${getColumnClass(status)}`}
                          >
                            <div className="flex flex-col">
                              <span className="font-bold">{getColumnLabel(index)}</span>
                              {header && <span className="text-gray-400 normal-case truncate max-w-20 font-normal">{header}</span>}
                              {preview.columnInfo[index]?.hasData && (
                                <span className="text-green-600 text-xs">✓</span>
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.sampleRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500 border-r border-gray-200 font-mono">
                          {preview.dataStartRow + rowIndex + 1}
                        </td>
                        {row.slice(0, 20).map((cell, cellIndex) => {
                          const status = getColumnStatus(cellIndex);
                          return (
                            <td
                              key={cellIndex}
                              className={`px-3 py-2 whitespace-nowrap text-xs border-r border-gray-200 max-w-32 truncate ${getColumnClass(status)}`}
                              title={cell?.toString() || ''}
                            >
                              <span className={isImportantColumn(cellIndex) ? 'font-semibold' : ''}>
                                {cell?.toString() || ''}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Legend */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-800 mb-2">Column Legend:</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span>Required data found</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                    <span>Required data missing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                    <span>Has data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
                    <span>Empty</span>
                  </div>
                </div>
              </div>

              {/* Expected Format Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-blue-800 mb-2">Expected Format for {fileType}:</h5>
                <div className="text-xs text-blue-700 space-y-1">
                  {fileType === 'invoice' ? (
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Column F:</strong> HS codes (required)</li>
                      <li><strong>Column O or P:</strong> Invoice amounts (system checks P first, then O)</li>
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Column F:</strong> HS codes (for matching with invoice)</li>
                      <li><strong>Column H:</strong> Number of cartons</li>
                      <li><strong>Column L:</strong> Net weight</li>
                      <li><strong>Column M:</strong> Gross weight</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};