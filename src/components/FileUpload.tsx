import React, { useCallback } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  title: string;
  file: File | null;
  onFileSelect: (file: File) => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  title,
  file,
  onFileSelect,
  accept = '.xlsx,.xls'
}) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.match(/\.(xlsx|xls)$/i)) {
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
        file
          ? 'border-green-400 bg-green-50'
          : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        id={`file-${title.replace(/\s+/g, '-').toLowerCase()}`}
      />
      
      <label
        htmlFor={`file-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="cursor-pointer"
      >
        <div className="flex flex-col items-center space-y-4">
          {file ? (
            <CheckCircle className="w-12 h-12 text-green-500" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
            {file ? (
              <div className="flex items-center space-x-2 text-green-600">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                <p>Drop your Excel file here or click to browse</p>
                <p className="mt-1">Supports .xlsx and .xls files</p>
              </div>
            )}
          </div>
        </div>
      </label>
    </div>
  );
};