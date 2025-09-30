// DISABLED: This route resets and reinitializes the Google Sheets
// import { NextResponse } from 'next/server';
// import { GoogleSheetsService } from '../../../utils/googleSheets';

export async function GET() {
  return NextResponse.json({ 
    message: 'This route has been disabled to prevent Google Sheets reset',
    status: 'disabled'
  }, { status: 403 });

  // DISABLED CODE - This was resetting and reinitializing the Google Sheets:
  // try {
  //   const googleSheetsService = new GoogleSheetsService();
  //   
  //   console.log('Setting up Google Sheets with new structure...');
  //   
  //   const initSuccess = await googleSheetsService.initializeSheet();
  //   if (!initSuccess) {
  //     return NextResponse.json(
  //       { error: 'Failed to initialize sheet headers' },
  //       { status: 500 }
  //     );
  //   }

  //   const sampleSuccess = await googleSheetsService.addSampleData();
  //   if (!sampleSuccess) {
  //     return NextResponse.json(
  //       { error: 'Failed to add sample data' },
  //       { status: 500 }
  //     );
  //   }

  //   return NextResponse.json({ 
  //     message: 'Google Sheets setup completed successfully!',
  //     structure: {
  //       headers: ['Codigo', 'Habilitado', 'Email', 'Date'],
  //       sampleData: [
  //         {
  //           code: '748dpo',
  //           status: 'Habilitado',
  //           email: '',
  //           date: ''
  //         },
  //         {
  //           code: 'abc123',
  //           status: 'Deshabilitado',
  //           email: 'maria.gonzalez@email.com',
  //           date: '02/09/2025 14:30:25'
  //         },
  //         {
  //           code: 'xyz789',
  //           status: 'Deshabilitado',
  //           email: 'carlos.rodriguez@empresa.com',
  //           date: '03/09/2025 09:15:42'
  //         }
  //       ]
  //     }
  //   });
  // } catch (error) {
  //   console.error('Setup error:', error);
  //   return NextResponse.json(
  //     { error: 'Setup failed', details: error instanceof Error ? error.message : 'Unknown error' },
  //     { status: 500 }
  //   );
  // }
}