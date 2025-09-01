import React from 'react';
import { Info, FileText, Package, Calculator } from 'lucide-react';

export const Instructions: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Invoice File:</strong> HS codes from Column F and amounts from Column O or P (line by line)
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Package className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Packing List:</strong> For each invoice line, corresponding data is extracted 
                from the same line number - Column H (cartons), Column L (net weight), Column M (gross weight)
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Calculator className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Processing:</strong> Line-by-line matching extracts data from corresponding rows. 
                Then, all data is grouped by HS code and summed - each HS code appears only once with total amounts, weights, and cartons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};