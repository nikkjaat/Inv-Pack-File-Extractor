import React from 'react';
import { Calculator, FileSpreadsheet } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calculator className="w-8 h-8 text-blue-600" />
            <FileSpreadsheet className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Excel Data Analyzer
            </h1>
            <p className="text-gray-600 mt-1">
              Upload Excel files to calculate gross weight, net weight, and carton counts by HS code
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};