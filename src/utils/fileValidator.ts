import * as XLSX from 'xlsx';

export const validateExcelFile = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      resolve(false);
    }
    
    // Additional MIME type check
    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    resolve(validMimeTypes.includes(file.type) || validExtensions.includes(fileExtension));
  });
};

export const validateFileStructure = async (file: File, fileType: 'invoice' | 'packingList'): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> => {
  try {
    const reader = new FileReader();
    
    return new Promise((resolve) => {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (jsonData.length < 2) {
            errors.push('File must contain at least 2 rows (header + data)');
          }
          
          // Find where actual data starts
          let dataStartRow = 1;
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row && row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
              dataStartRow = i;
              break;
            }
          }
          
          const dataRows = jsonData.slice(dataStartRow);
          
          if (fileType === 'invoice') {
            // Check for HS codes in column F (index 5)
            let hsCodeCount = 0;
            let amountCount = 0;
            
            for (let i = 0; i < Math.min(dataRows.length, 20); i++) {
              const row = dataRows[i] as any[];
              if (!row) continue;
              if (row[5]) hsCodeCount++;
              if (row[14] || row[15]) amountCount++;
            }
            
            if (hsCodeCount === 0) {
              errors.push('No HS codes found in Column F');
            }
            if (amountCount === 0) {
              warnings.push('No amounts found in Columns O or P');
            }
          } else {
            // Check for packing list data
            let weightCount = 0;
            let cartonCount = 0;
            
            for (let i = 0; i < Math.min(dataRows.length, 20); i++) {
              const row = dataRows[i] as any[];
              if (!row) continue;
              if (row[11] || row[12]) weightCount++;
              if (row[7]) cartonCount++;
            }
            
            if (weightCount === 0) {
              warnings.push('No weight data found in Columns L or M');
            }
            if (cartonCount === 0) {
              warnings.push('No carton data found in Column H');
            }
          }
          
          resolve({
            isValid: errors.length === 0,
            errors,
            warnings
          });
        } catch (error) {
          resolve({
            isValid: false,
            errors: ['Failed to parse Excel file'],
            warnings: []
          });
        }
      };
      
      reader.readAsArrayBuffer(file);
    });
  } catch (error) {
    return {
      isValid: false,
      errors: ['Failed to read file'],
      warnings: []
    };
  }
};