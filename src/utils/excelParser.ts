import * as XLSX from 'xlsx';
import { InvoiceRow, PackingListRow } from '../types';

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

export const parseInvoiceData = (rawData: any[]): InvoiceRow[] => {
  if (rawData.length < 2) return [];
  
  const headers = rawData[0];
  const hsCodeIndex = 5; // Column F (0-indexed)
  const amountIndexO = 14; // Column O (0-indexed)
  const amountIndexP = 15; // Column P (0-indexed)
  
  return rawData.slice(1).map(row => ({
    hsCode: row[hsCodeIndex]?.toString()?.trim() || '',
    amount: parseFloat(row[amountIndexP]) || parseFloat(row[amountIndexO]) || 0,
    rowData: row
  })).filter(item => item.hsCode);
};

export const parsePackingListData = (rawData: any[]): PackingListRow[] => {
  if (rawData.length < 2) return [];
  
  const headers = rawData[0];
  const cartonsIndex = 7; // Column H (0-indexed)
  const netWeightIndex = 11; // Column L (0-indexed)
  const grossWeightIndex = 12; // Column M (0-indexed)
  
  return rawData.slice(1).map(row => {
    const hsCode = row[5]?.toString()?.trim() || ''; // Assuming HS code is also in column F
    const cartonsStr = row[cartonsIndex]?.toString() || '0';
    const netWeightStr = row[netWeightIndex]?.toString() || '0';
    const grossWeightStr = row[grossWeightIndex]?.toString() || '0';
    
    return {
      hsCode,
      cartons: parseMultiValue(cartonsStr),
      netWeight: parseMultiValue(netWeightStr),
      grossWeight: parseMultiValue(grossWeightStr),
      rowData: row
    };
  }).filter(item => item.hsCode);
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