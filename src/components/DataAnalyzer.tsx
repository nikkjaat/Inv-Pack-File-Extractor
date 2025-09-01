import React, { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { ProcessingStatus } from './ProcessingStatus';
import { ResultsTable } from './ResultsTable';
import { parseExcelFile, parseInvoiceData, parsePackingListData } from '../utils/excelParser';
import { processData } from '../utils/dataProcessor';
import { FileUploadState, ProcessedData } from '../types';

export const DataAnalyzer: React.FC = () => {
  const [files, setFiles] = useState<FileUploadState>({
    invoice: null,
    packingList: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = useCallback(() => {
    setFiles({ invoice: null, packingList: null });
    setResults([]);
    setError(null);
  }, []);

  const handleFileSelect = useCallback((type: 'invoice' | 'packingList') => (file: File) => {
    setFiles(prev => ({ ...prev, [type]: file }));
    setResults([]);
    setError(null);
  }, []);

  const processFiles = useCallback(async () => {
    if (!files.invoice || !files.packingList) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Parse both Excel files
      const [invoiceRawData, packingListRawData] = await Promise.all([
        parseExcelFile(files.invoice),
        parseExcelFile(files.packingList)
      ]);

      // Process the raw data
      const invoiceData = parseInvoiceData(invoiceRawData);
      const packingListData = parsePackingListData(packingListRawData);

      if (invoiceData.length === 0) {
        throw new Error('No valid HS codes found in Invoice file (Column F)');
      }

      if (packingListData.length === 0) {
        throw new Error('No valid data found in Packing List file');
      }

      // Calculate results
      const processedData = processData(invoiceData, packingListData);
      setResults(processedData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing files');
    } finally {
      setIsProcessing(false);
    }
  }, [files]);

  const canProcess = files.invoice && files.packingList && !isProcessing;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Upload Files</h2>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Upload New Files</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FileUpload
          title="Invoice File"
          file={files.invoice}
          onFileSelect={handleFileSelect('invoice')}
        />
        <FileUpload
          title="Packing List File"
          file={files.packingList}
          onFileSelect={handleFileSelect('packingList')}
        />
      </div>

      {canProcess && (
        <div className="flex justify-center">
          <button
            onClick={processFiles}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Process Files
          </button>
        </div>
      )}

      <ProcessingStatus
        isProcessing={isProcessing}
        hasResults={results.length > 0}
        error={error}
      />

      {results.length > 0 && <ResultsTable data={results} />}
    </div>
  );
};