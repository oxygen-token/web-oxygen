// DISABLED: This route resets and repopulates the entire Google Sheets
import { NextResponse } from 'next/server';
// import { GoogleSheetsService } from '../../../utils/googleSheets';

export async function GET() {
  return NextResponse.json({ 
    message: 'This route has been disabled to prevent Google Sheets reset',
    status: 'disabled'
  }, { status: 403 });

  // DISABLED CODE - This was clearing and repopulating the entire Google Sheets:
  // try {
  //   const googleSheetsService = new GoogleSheetsService();
  //   
  //   console.log('Starting population of all affiliate codes...');
  //   
  //   const success = await googleSheetsService.populateAllAffiliateCodes();

  //   if (success) {
  //     return NextResponse.json({ 
  //       message: 'Google Sheets populated successfully with 300 affiliate codes!',
  //       status: 'success'
  //     });
  //   } else {
  //     return NextResponse.json(
  //       { error: 'Failed to populate Google Sheets with affiliate codes' },
  //       { status: 500 }
  //     );
  //   }
  // } catch (error) {
  //   console.error('Population error:', error);
  //   return NextResponse.json(
  //     { error: 'Population failed', details: error instanceof Error ? error.message : 'Unknown error' },
  //     { status: 500 }
  //   );
  // }
}