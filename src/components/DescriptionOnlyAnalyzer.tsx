import React, { useState, useCallback } from 'react';
import { RefreshCw, Eye, FileText } from 'lucide-react';
import { ExcelFileUpload } from './ExcelFileUpload';
import { ProcessingStatus } from './ProcessingStatus';
import { FilePreview } from './FilePreview';
import { DescriptionTable } from './DescriptionTable';
import { parseExcelFile, extractDescriptions } from '../utils/excelParser';
import { DescriptionRow } from '../types';

export const DescriptionOnlyAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [descriptionData, setDescriptionData] = useState<DescriptionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleRefresh = useCallback(() => {
    setFile(null);
    setDescriptionData([]);
    setError(null);
    setShowPreview(false);
  }, []);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setDescriptionData([]);
    setError(null);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Parse Excel file
      const rawData = await parseExcelFile(file);
      
      // Extract descriptions from Column A starting at row 12
      const descriptions = extractDescriptions(rawData);
      
      if (descriptions.length === 0) {
        throw new Error('No description data found in Column A starting from row 12');
      }

      setDescriptionData(descriptions);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file');
    } finally {
      setIsProcessing(false);
    }
  }, [file]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Upload Invoice File</h2>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Upload New File</span>
        </button>
      </div>

      <div className="max-w-md mx-auto space-y-3">
        <ExcelFileUpload
          title="Invoice File"
          file={file}
          onFileSelect={handleFileSelect}
          fileType="invoice"
        />
        {file && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Hide Preview' : 'Preview Data'}</span>
          </button>
        )}
      </div>

      {showPreview && file && (
        <FilePreview
          file={file}
          fileType="invoice"
          onClose={() => setShowPreview(false)}
        />
      )}

      {file && !isProcessing && descriptionData.length === 0 && !error && (
        <div className="flex justify-center">
          <button
            onClick={handleProcess}
            className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <FileText className="w-5 h-5" />
            <span>Extract Descriptions</span>
          </button>
        </div>
      )}

      <ProcessingStatus
        isProcessing={isProcessing}
        hasResults={descriptionData.length > 0}
        error={error}
      />

      {descriptionData.length > 0 && (
        <DescriptionTable 
          data={descriptionData} 
          fileName={file?.name || 'Invoice'}
          showExportOptions={true}
        />
      )}
    </div>
  );
};
