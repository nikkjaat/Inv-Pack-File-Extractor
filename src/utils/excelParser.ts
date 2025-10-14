import * as XLSX from 'xlsx';
import { InvoiceRow, PackingListRow } from '../types';

export const getFilePreview = async (file: File): Promise<{ 
  headers: string[]; 
  sampleRows: any[][]; 
  totalRows: number; 
  dataStartRow: number;
  columnInfo: { [key: number]: { hasData: boolean; sampleValues: string[] } };
}> => {
  const rawData = await parseExcelFile(file);
  
  // Find where actual data starts (skip empty rows)
  let dataStartRow = 1;
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (row && row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
      dataStartRow = i;
      break;
    }
  }
  
  const headers = rawData[0] || [];
  const dataRows = rawData.slice(dataStartRow);
  const sampleRows = dataRows.slice(0, 10); // Show more rows for better preview
  
  // Analyze column data to show which columns have actual data
  const columnInfo: { [key: number]: { hasData: boolean; sampleValues: string[] } } = {};
  
  for (let colIndex = 0; colIndex < Math.min(headers.length, 20); colIndex++) {
    const values: string[] = [];
    let hasData = false;
    
    for (let rowIndex = 0; rowIndex < Math.min(dataRows.length, 20); rowIndex++) {
      const cell = dataRows[rowIndex]?.[colIndex];
      if (cell !== null && cell !== undefined && cell !== '') {
        hasData = true;
        const cellStr = cell.toString().trim();
        if (cellStr && values.length < 3) {
          values.push(cellStr);
        }
      }
    }
    
    columnInfo[colIndex] = { hasData, sampleValues: values };
  }
  
  return {
    headers,
    sampleRows,
    totalRows: dataRows.length,
    dataStartRow,
    columnInfo
  };
};

export const parseExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const parseInvoiceData = (rawData: any[], hsCodeColumns: number[], amountColumns: number[]): InvoiceRow[] => {
  if (rawData.length < 2) return [];
  
  // Find where actual data starts (skip empty rows)
  let dataStartRow = 1;
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (row && row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
      dataStartRow = i;
      break;
    }
  }
  
  return rawData.slice(dataStartRow).map((row, index) => {
    // Get HS code from the first specified column that has data
    let hsCode = '';
    for (const colIndex of hsCodeColumns) {
      const value = row[colIndex]?.toString()?.trim();
      if (value) {
        hsCode = value;
        break;
      }
    }
    
    // Sum amounts from all specified columns
    let amount = 0;
    for (const colIndex of amountColumns) {
      const value = parseFloat(row[colIndex]) || 0;
      amount += value;
    }
    
    return {
      hsCode,
      amount,
      rowData: row
    };
  }).filter(item => item.hsCode && item.amount > 0);
};

export const parsePackingListData = (rawData: any[], cartonsColumns: number[], netWeightColumns: number[], grossWeightColumns: number[]): PackingListRow[] => {
  if (rawData.length < 2) return [];
  
  // Find where actual data starts (skip empty rows)
  let dataStartRow = 1;
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (row && row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
      dataStartRow = i;
      break;
    }
  }
  
  return rawData.slice(dataStartRow).map((row, index) => {
    // Sum cartons from all specified columns
    let cartons = 0;
    for (const colIndex of cartonsColumns) {
      const value = row[colIndex]?.toString() || '0';
      cartons += parseMultiValue(value);
    }
    
    // Sum net weight from all specified columns
    let netWeight = 0;
    for (const colIndex of netWeightColumns) {
      const value = row[colIndex]?.toString() || '0';
      netWeight += parseMultiValue(value);
    }
    
    // Sum gross weight from all specified columns
    let grossWeight = 0;
    for (const colIndex of grossWeightColumns) {
      const value = row[colIndex]?.toString() || '0';
      grossWeight += parseMultiValue(value);
    }
    
    return {
      hsCode: '', // HS code comes from invoice file
      cartons,
      netWeight,
      grossWeight,
      rowData: row
    };
  }).filter((item, index) => item.cartons > 0 || item.netWeight > 0 || item.grossWeight > 0);
};

const parseMultiValue = (value: string): number => {
  if (!value) return 0;
  
  // Handle multiple values separated by common delimiters
  const cleanValue = value.toString().replace(/[^\d.,+\-\s]/g, '');
  
  // Split by common delimiters and sum
  const numbers = cleanValue
    .split(/[,+\s]+/)
    .map(num => parseFloat(num.trim()))
    .filter(num => !isNaN(num));
  
  return numbers.reduce((sum, num) => sum + num, 0);
};

export const extractDescriptions = (rawData: any[]): DescriptionRow[] => {
  const descriptions: DescriptionRow[] = [];
  
  // Start from row 12 (index 11) and extract from Column A (index 0)
  for (let i = 11; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || !row[0]) continue;
    
    const cellValue = row[0].toString().trim();
    
    // Stop when we find "Net Weight" (case insensitive)
    if (cellValue.toLowerCase().includes('net weight')) {
      break;
    }
    
    // Only add non-empty descriptions
    if (cellValue) {
      descriptions.push({
        rowNumber: i + 1, // Excel row number (1-based)
        description: cellValue
      });
    }
  }
  
  return descriptions;
};