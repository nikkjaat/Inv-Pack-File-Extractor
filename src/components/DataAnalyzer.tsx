import React, { useState, useCallback } from 'react';
import { RefreshCw, Eye, Settings } from 'lucide-react';
import { ExcelFileUpload } from './ExcelFileUpload';
import { ProcessingStatus } from './ProcessingStatus';
import { ResultsTable } from './ResultsTable';
import { DetailedTable } from './DetailedTable';
import { FilePreview } from './FilePreview';
import { ColumnInputModal } from './ColumnInputModal';
import { parseExcelFile, parseInvoiceData, parsePackingListData, getFilePreview } from '../utils/excelParser';
import { extractDescriptions } from '../utils/excelParser';
import { processData } from '../utils/dataProcessor';
import { FileUploadState, ProcessedData, DetailedRow, FileColumnMapping, DescriptionRow } from '../types';
import { DescriptionTable } from './DescriptionTable';

export const DataAnalyzer: React.FC = () => {
  const [files, setFiles] = useState<FileUploadState>({
    invoice: null,
    packingList: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedData[]>([]);
  const [detailedResults, setDetailedResults] = useState<DetailedRow[]>([]);
  const [descriptionData, setDescriptionData] = useState<DescriptionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<'invoice' | 'packingList' | null>(null);
  const [showColumnInput, setShowColumnInput] = useState(false);

  const handleRefresh = useCallback(() => {
    setFiles({ invoice: null, packingList: null });
    setResults([]);
    setDetailedResults([]);
    setDescriptionData([]);
    setError(null);
    setShowPreview(null);
    setShowColumnInput(false);
  }, []);

  const handleFileSelect = useCallback((type: 'invoice' | 'packingList') => (file: File) => {
    setFiles(prev => ({ ...prev, [type]: file }));
    setResults([]);
    setDetailedResults([]);
    setDescriptionData([]);
    setError(null);
  }, []);

  const handleProcessClick = useCallback(async () => {
    setShowColumnInput(true);
  }, [files]);

  const processFiles = useCallback(async (columnMapping: any) => {
    if (!files.invoice || !files.packingList) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Parse both Excel files
      const [invoiceRawData, packingListRawData] = await Promise.all([
        parseExcelFile(files.invoice),
        parseExcelFile(files.packingList)
      ]);

      // Extract descriptions from invoice file (Column A, starting row 12)
      const descriptions = extractDescriptions(invoiceRawData);
      setDescriptionData(descriptions);

      // Process the raw data
      const invoiceData = parseInvoiceData(
        invoiceRawData,
        columnMapping.invoice.hsCode,
        columnMapping.invoice.invoiceAmount
      );
      const packingListData = parsePackingListData(
        packingListRawData,
        columnMapping.packingList.cartons,
        columnMapping.packingList.netWeight,
        columnMapping.packingList.grossWeight
      );

      if (invoiceData.length === 0) {
        throw new Error('No valid invoice data found. Please check your column mapping and ensure the selected columns contain valid data.');
      }

      if (packingListData.length === 0) {
        throw new Error('No valid packing list data found. Please check your column mapping and ensure the selected columns contain valid data.');
      }

      // Calculate results
      const { summary, detailed } = processData(invoiceData, packingListData);
      
      if (summary.length === 0) {
        throw new Error('No matching data found between invoice and packing list files');
      }

      setResults(summary);
      setDetailedResults(detailed);

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
        <h2 className="text-2xl font-bold text-gray-800">Upload Excel Files</h2>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Upload New Files</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <ExcelFileUpload
            title="Invoice File"
            file={files.invoice}
            onFileSelect={handleFileSelect('invoice')}
            fileType="invoice"
          />
          {files.invoice && (
            <button
              onClick={() => setShowPreview(showPreview === 'invoice' ? null : 'invoice')}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview === 'invoice' ? 'Hide Preview' : 'Preview Data'}</span>
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          <ExcelFileUpload
            title="Packing List File"
            file={files.packingList}
            onFileSelect={handleFileSelect('packingList')}
            fileType="packingList"
          />
          {files.packingList && (
            <button
              onClick={() => setShowPreview(showPreview === 'packingList' ? null : 'packingList')}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview === 'packingList' ? 'Hide Preview' : 'Preview Data'}</span>
            </button>
          )}
        </div>
      </div>

      {showPreview && files[showPreview] && (
        <FilePreview
          file={files[showPreview]}
          fileType={showPreview}
          onClose={() => setShowPreview(null)}
        />
      )}

      {canProcess && (
        <div className="flex justify-center">
          <button
            onClick={handleProcessClick}
            className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Settings className="w-5 h-5" />
            <span>Specify Columns & Process Data</span>
          </button>
        </div>
      )}

      {showColumnInput && (
        <ColumnInputModal
          isOpen={showColumnInput}
          onClose={() => setShowColumnInput(false)}
          onConfirm={processFiles}
        />
      )}

      <ProcessingStatus
        isProcessing={isProcessing}
        hasResults={results.length > 0}
        error={error}
      />

      {results.length > 0 && (
        <div className="space-y-8">
          <ResultsTable 
            data={results} 
            detailedData={detailedResults} 
            descriptionData={descriptionData}
          />
          <DescriptionTable data={descriptionData} fileName={files.invoice?.name || 'Invoice'} />
          <DetailedTable data={detailedResults} />
        </div>
      )}
    </div>
  );
};