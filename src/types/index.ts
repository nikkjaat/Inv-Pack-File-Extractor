export interface InvoiceRow {
  hsCode: string;
  amount: number;
  [key: string]: any;
}

export interface PackingListRow {
  hsCode: string;
  grossWeight: number;
  netWeight: number;
  cartons: number;
  [key: string]: any;
}

export interface ProcessedData {
  hsCode: string;
  totalAmount: number;
  totalGrossWeight: number;
  totalNetWeight: number;
  totalCartons: number;
}

export interface FileUploadState {
  invoice: File | null;
  packingList: File | null;
}