export interface InvoiceRow {
  hsCode: string;
  amount: number;
  rowData: any[];
}

export interface PackingListRow {
  hsCode: string;
  grossWeight: number;
  netWeight: number;
  cartons: number;
  rowData: any[];
}

export interface ProcessedData {
  hsCode: string;
  totalAmount: number;
  totalGrossWeight: number;
  totalNetWeight: number;
  totalCartons: number;
  lineCount: number; // Number of lines that contributed to this HS code
}

export interface DetailedRow {
  lineNumber: number;
  hsCode: string;
  invoiceAmount: number;
  grossWeight: number;
  netWeight: number;
  cartons: number;
}

export interface DescriptionRow {
  rowNumber: number;
  description: string;
}

export interface FileUploadState {
  invoice: File | null;
  packingList: File | null;
}

export interface ColumnMapping {
  hsCode: number[];
  invoiceAmount: number[];
  grossWeight: number[];
  netWeight: number[];
  cartons: number[];
}

export interface FileColumnMapping {
  invoice: {
    hsCode: number[];
    invoiceAmount: number[];
  };
  packingList: {
    grossWeight: number[];
    netWeight: number[];
    cartons: number[];
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
  validRowCount: number;
}