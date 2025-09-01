import { InvoiceRow, PackingListRow, ProcessedData } from '../types';

export const processData = (
  invoiceData: InvoiceRow[],
  packingListData: PackingListRow[]
): ProcessedData[] => {
  // Step 1: Process line by line - each invoice line matches with corresponding packing list line
  const lineByLineData: ProcessedData[] = [];
  
  invoiceData.forEach((invoiceRow, index) => {
    // Find corresponding packing list row at the same line index
    const packingListRow = packingListData[index];
    
    if (packingListRow && invoiceRow.hsCode) {
      lineByLineData.push({
        hsCode: invoiceRow.hsCode,
        totalAmount: invoiceRow.amount,
        totalGrossWeight: packingListRow.grossWeight,
        totalNetWeight: packingListRow.netWeight,
        totalCartons: packingListRow.cartons
      });
    }
  });
  
  // Step 2: Group by HS code and sum the values
  const hsCodeMap = new Map<string, ProcessedData>();
  
  lineByLineData.forEach(row => {
    const existing = hsCodeMap.get(row.hsCode);
    
    if (existing) {
      // Add to existing HS code
      existing.totalAmount += row.totalAmount;
      existing.totalGrossWeight += row.totalGrossWeight;
      existing.totalNetWeight += row.totalNetWeight;
      existing.totalCartons += row.totalCartons;
    } else {
      // Create new entry for this HS code
      hsCodeMap.set(row.hsCode, {
        hsCode: row.hsCode,
        totalAmount: row.totalAmount,
        totalGrossWeight: row.totalGrossWeight,
        totalNetWeight: row.totalNetWeight,
        totalCartons: row.totalCartons
      });
    }
  });
  
  // Convert map to array and sort by HS code
  return Array.from(hsCodeMap.values()).sort((a, b) => a.hsCode.localeCompare(b.hsCode));
};

export const exportToCSV = (data: ProcessedData[]): string => {
  const headers = ['HS Code', 'Total Amount', 'Total Gross Weight', 'Total Net Weight', 'Total Cartons'];
  const rows = data.map(row => [
    row.hsCode,
    row.totalAmount.toFixed(2),
    row.totalGrossWeight.toFixed(2),
    row.totalNetWeight.toFixed(2),
    row.totalCartons.toString()
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
};