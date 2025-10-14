import React, { useState } from 'react';
import { X, Info, Plus, Minus } from 'lucide-react';

interface ColumnMapping {
  invoice: {
    hsCode: string[];
    invoiceAmount: string[];
  };
  packingList: {
    hsCode: string[];
    grossWeight: string[];
    netWeight: string[];
    cartons: string[];
  };
}

interface ColumnInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mapping: ColumnMapping) => void;
}

export const ColumnInputModal: React.FC<ColumnInputModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [mapping, setMapping] = useState<ColumnMapping>({
    invoice: {
      hsCode: ['F'],
      invoiceAmount: ['P', 'O']
    },
    packingList: {
      grossWeight: ['M'],
      netWeight: ['L'],
      cartons: ['H']
    }
  });

  const convertColumnToIndex = (column: string): number => {
    const col = column.toString().toUpperCase().trim();
    
    // If it's already a number, convert to 0-based index
    if (/^\d+$/.test(col)) {
      return Math.max(0, parseInt(col) - 1);
    }
    
    // If it's a letter, convert A=0, B=1, etc.
    if (/^[A-Z]+$/.test(col)) {
      let result = 0;
      for (let i = 0; i < col.length; i++) {
        result = result * 26 + (col.charCodeAt(i) - 64);
      }
      return result - 1;
    }
    
    return 0; // Default to column A if invalid
  };

  const addColumn = (fileType: 'invoice' | 'packingList', field: string) => {
    setMapping(prev => ({
      ...prev,
      [fileType]: {
        ...prev[fileType],
        [field]: [...(prev[fileType] as any)[field], 'A']
      }
    }));
  };

  const removeColumn = (fileType: 'invoice' | 'packingList', field: string, index: number) => {
    setMapping(prev => ({
      ...prev,
      [fileType]: {
        ...prev[fileType],
        [field]: (prev[fileType] as any)[field].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const updateColumn = (fileType: 'invoice' | 'packingList', field: string, index: number, value: string) => {
    setMapping(prev => ({
      ...prev,
      [fileType]: {
        ...prev[fileType],
        [field]: (prev[fileType] as any)[field].map((col: string, i: number) => i === index ? value : col)
      }
    }));
  };

  const handleConfirm = () => {
    // Convert all column references to indices
    const processedMapping = {
      invoice: {
        hsCode: mapping.invoice.hsCode.map(convertColumnToIndex),
        invoiceAmount: mapping.invoice.invoiceAmount.map(convertColumnToIndex)
      },
      packingList: {
        grossWeight: mapping.packingList.grossWeight.map(convertColumnToIndex),
        netWeight: mapping.packingList.netWeight.map(convertColumnToIndex),
        cartons: mapping.packingList.cartons.map(convertColumnToIndex)
      }
    };
    
    onConfirm(processedMapping);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Info className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Specify Column Locations</h3>
              <p className="text-sm text-gray-600">Enter column letters (A, B, C...) or numbers (1, 2, 3...)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Invoice File */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Invoice File</h4>
              
              {/* HS Code */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  HS Code Columns
                </label>
                {mapping.invoice.hsCode.map((column, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={column}
                      onChange={(e) => updateColumn('invoice', 'hsCode', index, e.target.value)}
                      placeholder="F or 6"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {mapping.invoice.hsCode.length > 1 && (
                      <button
                        onClick={() => removeColumn('invoice', 'hsCode', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addColumn('invoice', 'hsCode')}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Column</span>
                </button>
              </div>

              {/* Invoice Amount */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Invoice Amount Columns
                </label>
                {mapping.invoice.invoiceAmount.map((column, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={column}
                      onChange={(e) => updateColumn('invoice', 'invoiceAmount', index, e.target.value)}
                      placeholder="P or 16"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {mapping.invoice.invoiceAmount.length > 1 && (
                      <button
                        onClick={() => removeColumn('invoice', 'invoiceAmount', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addColumn('invoice', 'invoiceAmount')}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Column</span>
                </button>
              </div>
            </div>

            {/* Packing List File */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Packing List File</h4>
              
              {/* HS Code */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Total Gross Weight Columns
                </label>
                {mapping.packingList.grossWeight.map((column, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={column}
                      onChange={(e) => updateColumn('packingList', 'grossWeight', index, e.target.value)}
                      placeholder="M or 13"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {mapping.packingList.grossWeight.length > 1 && (
                      <button
                        onClick={() => removeColumn('packingList', 'grossWeight', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addColumn('packingList', 'grossWeight')}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Column</span>
                </button>
              </div>

              {/* Net Weight */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Total Net Weight Columns
                </label>
                {mapping.packingList.netWeight.map((column, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={column}
                      onChange={(e) => updateColumn('packingList', 'netWeight', index, e.target.value)}
                      placeholder="L or 12"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {mapping.packingList.netWeight.length > 1 && (
                      <button
                        onClick={() => removeColumn('packingList', 'netWeight', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addColumn('packingList', 'netWeight')}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Column</span>
                </button>
              </div>

              {/* Cartons */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Total Cartons Columns
                </label>
                {mapping.packingList.cartons.map((column, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={column}
                      onChange={(e) => updateColumn('packingList', 'cartons', index, e.target.value)}
                      placeholder="H or 8"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {mapping.packingList.cartons.length > 1 && (
                      <button
                        onClick={() => removeColumn('packingList', 'cartons', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addColumn('packingList', 'cartons')}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Column</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h5 className="text-sm font-medium text-blue-800 mb-2">Instructions:</h5>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>Enter column letters (A, B, C, D...) or numbers (1, 2, 3, 4...)</li>
              <li>You can add multiple columns for the same data type - values will be summed</li>
              <li>Examples: "F" or "6" for column F, "P" or "16" for column P</li>
              <li>HS codes are only required in the invoice file for matching data</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Process Files & Generate Analysis
          </button>
        </div>
      </div>
    </div>
  );
};