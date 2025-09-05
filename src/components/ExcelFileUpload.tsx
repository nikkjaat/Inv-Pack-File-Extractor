import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface ExcelFileUploadProps {
  title: string;
  file: File | null;
  onFileSelect: (file: File) => void;
  fileType: 'invoice' | 'packingList';
}

export const ExcelFileUpload: React.FC<ExcelFileUploadProps> = ({
  title,
  file,
  onFileSelect,
  fileType
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    isValidating: boolean;
    errors: string[];
    warnings: string[];
  }>({ isValidating: false, errors: [], warnings: [] });

  const processFile = useCallback(async (selectedFile: File) => {
    setValidationStatus({ isValidating: true, errors: [], warnings: [] });

    // Check if it's an Excel file based on extension
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    const isExcelFile = fileExtension === 'xlsx' || fileExtension === 'xls';
    
    if (!isExcelFile) {
      setValidationStatus({
        isValidating: false,
        errors: ['Please upload a valid Excel file (.xlsx or .xls)'],
        warnings: []
      });
      return;
    }

    // Simulate validation process
    setTimeout(() => {
      // Always accept the file after a brief delay to simulate validation
      setValidationStatus({
        isValidating: false,
        errors: [],
        warnings: []
      });
      onFileSelect(selectedFile);
    }, 500);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  }, [processFile]);

  const getStatusColor = () => {
    if (validationStatus.errors.length > 0) return 'border-red-400 bg-red-50';
    if (file && validationStatus.errors.length === 0) return 'border-green-400 bg-green-50';
    if (validationStatus.isValidating) return 'border-blue-400 bg-blue-50';
    if (dragActive) return 'border-blue-400 bg-blue-50';
    return 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50';
  };

  const getStatusIcon = () => {
    if (validationStatus.errors.length > 0) return <AlertCircle className="w-12 h-12 text-red-500" />;
    if (file && validationStatus.errors.length === 0) return <CheckCircle className="w-12 h-12 text-green-500" />;
    if (validationStatus.isValidating) return <FileSpreadsheet className="w-12 h-12 text-blue-500 animate-pulse" />;
    return <Upload className="w-12 h-12 text-gray-400" />;
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${getStatusColor()}`}
    >
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
        id={`file-${title.replace(/\s+/g, '-').toLowerCase()}`}
      />
      
      <label
        htmlFor={`file-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="cursor-pointer"
      >
        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
            
            {validationStatus.errors.length > 0 ? (
              <div className="text-red-600 space-y-1">
                {validationStatus.errors.map((error, index) => (
                  <p key={index} className="text-sm font-medium">{error}</p>
                ))}
                <p className="text-xs mt-2">Click to try again</p>
              </div>
            ) : validationStatus.isValidating ? (
              <div className="text-blue-600">
                <p className="text-sm font-medium">Processing Excel file...</p>
                <p className="text-xs mt-1">Please wait</p>
              </div>
            ) : file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                {validationStatus.warnings.length > 0 && (
                  <div className="text-yellow-600 space-y-1">
                    {validationStatus.warnings.map((warning, index) => (
                      <p key={index} className="text-xs">{warning}</p>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">Click to upload different file</p>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                <p>Drop your Excel file here or click to browse</p>
                <p className="mt-1">Supports .xlsx and .xls files only</p>
                <div className="mt-3 text-xs text-gray-400">
                  <p><strong>Expected format for {fileType}:</strong></p>
                  {fileType === 'invoice' ? (
                    <p>HS codes in Column F, amounts in Column O or P</p>
                  ) : (
                    <p>Cartons in Column H, weights in Columns L & M</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </label>
    </div>
  );
};