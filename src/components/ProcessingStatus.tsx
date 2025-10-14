import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ProcessingStatusProps {
  isProcessing: boolean;
  hasResults: boolean;
  error: string | null;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  isProcessing,
  hasResults,
  error
}) => {
  if (error) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <div>
          <p className="text-red-700 font-medium">Processing Error</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        <p className="text-blue-700 font-medium">Processing Excel files...</p>
      </div>
    );
  }

  if (hasResults) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <p className="text-green-700 font-medium">Data processed successfully!</p>
      </div>
    );
  }

  return null;
};