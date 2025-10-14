import { InvoiceRow, PackingListRow, ProcessedData, DetailedRow } from '../types';
import * as XLSX from 'xlsx';

export const processData = (
  invoiceData: InvoiceRow[],
  packingListData: PackingListRow[]
): { summary: ProcessedData[], detailed: DetailedRow[] } => {
  // Step 1: Process line by line - each invoice line matches with corresponding packing list line
  const lineByLineData: DetailedRow[] = [];
  
  invoiceData.forEach((invoiceRow, index) => {
    // Find corresponding packing list row at the same line index
    const packingListRow = packingListData[index];
    
    if (packingListRow && invoiceRow.hsCode) {
      lineByLineData.push({
        lineNumber: index + 1,
        hsCode: invoiceRow.hsCode,
        invoiceAmount: invoiceRow.amount,
        grossWeight: packingListRow.grossWeight,
        netWeight: packingListRow.netWeight,
        cartons: packingListRow.cartons
      });
    }
  });
  
  // Step 2: Group by HS code and sum the values
  const hsCodeMap = new Map<string, ProcessedData>();
  
  lineByLineData.forEach(row => {
    const existing = hsCodeMap.get(row.hsCode);
    
    if (existing) {
      // Add to existing HS code
      existing.totalAmount += row.invoiceAmount;
      existing.totalGrossWeight += row.grossWeight;
      existing.totalNetWeight += row.netWeight;
      existing.totalCartons += row.cartons;
      existing.lineCount += 1;
    } else {
      // Create new entry for this HS code
      hsCodeMap.set(row.hsCode, {
        hsCode: row.hsCode,
        totalAmount: row.invoiceAmount,
        totalGrossWeight: row.grossWeight,
        totalNetWeight: row.netWeight,
        totalCartons: row.cartons,
        lineCount: 1
      });
    }
  });
  
  // Convert map to array and sort by HS code
  const summary = Array.from(hsCodeMap.values()).sort((a, b) => a.hsCode.localeCompare(b.hsCode));
  
  return { summary, detailed: lineByLineData };
};

export const exportToCSV = (data: ProcessedData[]): string => {
  const headers = ['HS Code', 'Total Invoice Amount', 'Total Gross Weight', 'Total Net Weight', 'Total Cartons', 'Line Count'];
  const rows = data.map(row => [
    row.hsCode,
    row.totalAmount.toFixed(2),
    row.totalGrossWeight.toFixed(2),
    row.totalNetWeight.toFixed(2),
    row.totalCartons.toString(),
    row.lineCount.toString()
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
};

export const exportToExcel = (summaryData: ProcessedData[], detailedData: DetailedRow[], descriptionData?: DescriptionRow[]): void => {
  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Summary sheet
  const summaryHeaders = ['HS Code', 'Total Invoice Amount', 'Total Gross Weight', 'Total Net Weight', 'Total Cartons', 'Line Count'];
  const summaryRows = summaryData.map(row => [
    row.hsCode,
    row.totalAmount,
    row.totalGrossWeight,
    row.totalNetWeight,
    row.totalCartons,
    row.lineCount
  ]);
  
  // Add description data if provided
  let summarySheetData = [summaryHeaders, ...summaryRows];
  
  if (descriptionData && descriptionData.length > 0) {
    // Add 5 empty rows
    for (let i = 0; i < 5; i++) {
      summarySheetData.push([]);
    }
    
    // Add description header and data
    summarySheetData.push(['Description Data']);
    summarySheetData.push(['Row Number', 'Description']);
    
    descriptionData.forEach(desc => {
      summarySheetData.push([desc.rowNumber, desc.description]);
    });
  }
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary by HS Code');
  
  // Detailed sheet
  const detailedHeaders = ['Line Number', 'HS Code', 'Invoice Amount', 'Gross Weight', 'Net Weight', 'Cartons'];
  const detailedRows = detailedData.map(row => [
    row.lineNumber,
    row.hsCode,
    row.invoiceAmount,
    row.grossWeight,
    row.netWeight,
    row.cartons
  ]);
  const detailedSheet = XLSX.utils.aoa_to_sheet([detailedHeaders, ...detailedRows]);
  XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Line by Line Details');
  
  // Export file
  XLSX.writeFile(workbook, 'hs-code-analysis.xlsx');
};

export const exportDescriptionToCSV = (data: DescriptionRow[]): string => {
  const headers = ['Row Number', 'Description'];
  const rows = data.map(row => [
    row.rowNumber.toString(),
    row.description
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
};

export const exportDescriptionToExcel = (data: DescriptionRow[]): void => {
  const workbook = XLSX.utils.book_new();
  
  const headers = ['Row Number', 'Description'];
  const rows = data.map(row => [row.rowNumber, row.description]);
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
  XLSX.utils.book_append_sheet(workbook, sheet, 'Descriptions');
  XLSX.writeFile(workbook, 'invoice-descriptions.xlsx');
};