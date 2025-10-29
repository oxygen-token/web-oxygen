import { google } from 'googleapis';

const SHEETS_SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

interface AffiliateCodeData {
  code: string;
  isActive: boolean;
  usedBy: string | null;
  usedAt: string | null;
  usedEmail: string | null;
  bonusOMs: number;
  createdAt: string;
  updatedAt: string;
}

export class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID || '';
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: SHEETS_SCOPES,
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async addAffiliateCode(codeData: AffiliateCodeData): Promise<boolean> {
    try {
      const values = [
        [
          codeData.code,
          codeData.isActive ? 'SI' : 'NO',
          codeData.usedEmail || '',
          codeData.usedAt ? new Date(codeData.usedAt).toLocaleString('es-AR') : '',
        ],
      ];

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'A:D',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values,
        },
      });

      console.log('Affiliate code added to Google Sheets:', response.data);
      return true;
    } catch (error) {
      console.error('Error adding affiliate code to Google Sheets:', error);
      return false;
    }
  }

  async updateAffiliateCodeUsage(code: string, email: string, sheetName: string = 'Hoja 1', fullName?: string): Promise<boolean> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:E`,
      });

      const rows = response.data.values || [];
      let rowIndex = -1;

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === code) {
          rowIndex = i + 1;
          break;
        }
      }

      if (rowIndex === -1) {
        console.error('Affiliate code not found:', code);
        return false;
      }

      const updateValues = [
        [
          code,
          'NO',
          fullName || '',
          email,
          new Date().toLocaleString('es-AR'),
        ],
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A${rowIndex}:E${rowIndex}`,
        valueInputOption: 'RAW',
        resource: {
          values: updateValues,
        },
      });

      console.log('Affiliate code usage updated:', code);
      return true;
    } catch (error) {
      console.error('Error updating affiliate code usage:', error);
      return false;
    }
  }

  async verifyAffiliateCode(code: string): Promise<{ isValid: boolean; isUsed: boolean; message: string; sheetFound?: string }> {
    try {
      console.log(`Verifying affiliate code: ${code}`);
      
      // Buscar en ambas hojas
      const sheets = ['Hoja 1', 'Hoja 2'];
      
      for (const sheetName of sheets) {
        try {
          const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: `${sheetName}!A:E`,
          });

          const rows = response.data.values || [];
          
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row[0] === code) {
              const isActive = row[1] === 'YES' || row[1] === 'SI';
              const isUsed = row[3] && row[3].trim() !== '';
              
              if (!isActive) {
                return {
                  isValid: false,
                  isUsed: true,
                  message: 'Código de afiliado ya utilizado',
                  sheetFound: sheetName
                };
              }
              
              if (isUsed) {
                return {
                  isValid: false,
                  isUsed: true,
                  message: 'Código de afiliado ya utilizado',
                  sheetFound: sheetName
                };
              }
              
              return {
                isValid: true,
                isUsed: false,
                message: 'Código de afiliado válido',
                sheetFound: sheetName
              };
            }
          }
        } catch (sheetError) {
          console.log(`Sheet ${sheetName} not found or accessible, trying next sheet`);
          continue;
        }
      }
      
      return {
        isValid: false,
        isUsed: false,
        message: 'Código de afiliado no encontrado'
      };
    } catch (error) {
      console.error('Error verifying affiliate code:', error);
      return {
        isValid: false,
        isUsed: false,
        message: 'Error al verificar el código'
      };
    }
  }

  async initializeSheet(): Promise<boolean> {
    try {
      const headers = [
        'Code',
        'Enabled?',
        'Name',
        'Email',
        'Date',
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'A1:E1',
        valueInputOption: 'RAW',
        resource: {
          values: [headers],
        },
      });

      console.log('Google Sheets headers initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Google Sheets:', error);
      return false;
    }
  }

  async populateAllAffiliateCodes(): Promise<boolean> {
    try {
      console.log('Fetching all affiliate codes from backend...');
      
      // NUEVO: Log para ver qué URL está usando
      const backendUrl = process.env.NEXT_PUBLIC_AFFILIATE_BACKEND_URL || 'http://localhost:10001';
      console.log('NEXT_PUBLIC_AFFILIATE_BACKEND_URL value:', process.env.NEXT_PUBLIC_AFFILIATE_BACKEND_URL);
      console.log('Using backend URL:', backendUrl);
      
      console.log('Making request to:', `${backendUrl}/allAffiliateCodes`);
      const response = await fetch(`${backendUrl}/allAffiliateCodes`);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch affiliate codes: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);
      console.log('Response structure:', {
        success: data.success,
        hasData: !!data.data,
        hasCodes: !!data.data?.codes,
        codesLength: data.data?.codes?.length
      });
      
      if (!data.success || !data.data.codes) {
        throw new Error('Invalid response format from backend');
      }

      const allCodes = data.data.codes;
      const sixDigitCodes = allCodes.filter((code: any) => 
        code.code && code.code.length === 6 && /^[a-zA-Z0-9]{6}$/.test(code.code)
      ).slice(0, 300);

      console.log(`Found ${sixDigitCodes.length} six-digit codes out of ${allCodes.length} total codes (limited to 300)`);

      console.log('Clearing sheet...');
      await this.clearSheet();
      console.log('Initializing sheet headers...');
      await this.initializeSheet();

      const batchSize = 100;
      for (let i = 0; i < sixDigitCodes.length; i += batchSize) {
        const batch = sixDigitCodes.slice(i, i + batchSize);
        const values = batch.map((code: any) => [
          code.code,
          'SI',
          '',
          ''
        ]);

        const response = await this.sheets.spreadsheets.values.append({
          spreadsheetId: this.spreadsheetId,
          range: 'A:D',
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values,
          },
        });

        console.log(`Added batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sixDigitCodes.length / batchSize)} - Response:`, response.data);
      }

      console.log(`Successfully populated Google Sheets with ${sixDigitCodes.length} affiliate codes (limited to 300)`);
      return true;
    } catch (error) {
      console.error('Error populating affiliate codes:', error);
      return false;
    }
  }

  async addSampleData(): Promise<boolean> {
    try {
      const sampleData = [
        ['748dpo', 'SI', '', ''],
        ['abc123', 'NO', 'maria.gonzalez@email.com', '02/09/2025 14:30:25'],
        ['xyz789', 'NO', 'carlos.rodriguez@empresa.com', '03/09/2025 09:15:42']
      ];

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'A:D',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: sampleData,
        },
      });

      console.log('Sample data added successfully');
      return true;
    } catch (error) {
      console.error('Error adding sample data:', error);
      return false;
    }
  }

  async clearSheet(): Promise<boolean> {
    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: 'A:D',
      });
      console.log('Google Sheet cleared');
      return true;
    } catch (error) {
      console.error('Error clearing sheet:', error);
      return false;
    }
  }
}
