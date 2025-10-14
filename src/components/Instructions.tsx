import React from 'react';
import { Info, FileText, Package, Calculator } from 'lucide-react';

export const Instructions: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Instructions</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Full Analysis:</strong> Upload both invoice and packing list Excel files. Specify exact columns for HS codes, amounts, weights, and cartons. Get complete analysis with export options.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Package className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Description Only:</strong> Upload only the invoice Excel file to extract description data from Column A (starting row 12, stopping at "Net Weight"). Quick extraction with export options.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Calculator className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Flexible Columns:</strong> You can specify any columns using letters (A, B, C...) or numbers (1, 2, 3...). Multiple columns for the same data type are automatically summed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};