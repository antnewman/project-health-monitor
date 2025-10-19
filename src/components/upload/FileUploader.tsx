/**
 * File Uploader Component
 * Drag & drop zone for CSV/Excel file uploads
 */

import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { processUploadedFile } from '@/lib/dataProcessing';
import type { Task, ValidationResult } from '@/types';

interface FileUploaderProps {
  onFileProcessed: (tasks: Task[], validation: ValidationResult) => void;
  onError: (error: string) => void;
}

/**
 * File Uploader Component
 */
export const FileUploader: React.FC<FileUploaderProps> = ({ onFileProcessed, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    const validExtensions = ['csv', 'xlsx', 'xls'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !validExtensions.includes(extension)) {
      return 'Invalid file type. Please upload a CSV or Excel file.';
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return 'File size exceeds 50MB limit.';
    }

    return null;
  };

  const processFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      onError(error);
      return;
    }

    setCurrentFile(file);
    setIsProcessing(true);
    setProgress('Reading file...');

    try {
      setProgress('Parsing data...');
      const { tasks, validation } = await processUploadedFile(file);

      setProgress('Validating data...');
      await new Promise(resolve => setTimeout(resolve, 300)); // Brief delay for UX

      if (validation.valid || validation.recordsValid > 0) {
        setProgress('Processing complete!');
        setTimeout(() => {
          onFileProcessed(tasks, validation);
          setIsProcessing(false);
          setProgress('');
        }, 500);
      } else {
        onError(`Validation failed: ${validation.errors.join(', ')}`);
        setIsProcessing(false);
        setCurrentFile(null);
        setProgress('');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      onError(errorMessage);
      setIsProcessing(false);
      setCurrentFile(null);
      setProgress('');
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await processFile(files[0]);
      }
    },
    [onFileProcessed, onError]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await processFile(files[0]);
      }
    },
    [onFileProcessed, onError]
  );

  if (isProcessing) {
    return (
      <div className="bg-white rounded-lg border-2 border-blue-300 p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-1">Processing File</p>
            <p className="text-sm text-gray-600">{progress}</p>
            {currentFile && (
              <p className="text-xs text-gray-500 mt-2">{currentFile.name}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Upload className={`w-12 h-12 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Project Data
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop your CSV or Excel file here, or click to browse
            </p>

            <label className="inline-block">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isProcessing}
              />
              <span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block font-medium">
                Select File
              </span>
            </label>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV, XLSX, XLS</span>
            </div>
            <div>Max 50MB</div>
          </div>
        </div>
      </div>

      {/* Expected Format Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Expected File Format</h4>
            <p className="text-xs text-blue-800 mb-2">
              Your file should contain columns for task details including:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
              <div>• Portfolio Name</div>
              <div>• Project Name</div>
              <div>• Task ID & Name</div>
              <div>• Functional Manager</div>
              <div>• Planned/Actual Duration</div>
              <div>• Resource Assignment</div>
              <div>• Budget Information</div>
              <div>• Date Fields</div>
            </div>
            <p className="text-xs text-blue-800 mt-2">
              The system will automatically detect and map column names.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
