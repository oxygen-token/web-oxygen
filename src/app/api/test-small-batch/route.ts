// DISABLED: This route clears and resets the Google Sheets
import { NextResponse } from 'next/server';
// import { GoogleSheetsService } from '../../../utils/googleSheets';

export async function GET() {
  return NextResponse.json({ 
    message: 'This route has been disabled to prevent Google Sheets reset',
    status: 'disabled'
  }, { status: 403 });

  // DISABLED CODE - This was clearing and resetting the Google Sheets:
  // try {
  //   const googleSheetsService = new GoogleSheetsService();
  //   
  //   console.log('Testing small batch population...');
  //   
  //   await googleSheetsService.clearSheet();
  //   await googleSheetsService.initializeSheet();
  //   
  //   const testCodes = [
  //     { code: '123abc', isActive: true, usedBy: null, usedAt: null, usedEmail: null, bonusOMs: 5, createdAt: '2025-09-01T00:49:15.788+00:00', updatedAt: '2025-09-04T13:10:54.589+00:00' },
  //     { code: '456def', isActive: true, usedBy: null, usedAt: null, usedEmail: null, bonusOMs: 5, createdAt: '2025-09-01T00:49:15.788+00:00', updatedAt: '2025-09-04T13:10:54.589+00:00' },
  //     { code: '789ghi', isActive: true, usedBy: null, usedAt: null, usedEmail: null, bonusOMs: 5, createdAt: '2025-09-01T00:49:15.788+00:00', updatedAt: '2025-09-04T13:10:54.589+00:00' }
  //   ];

  //   for (const codeData of testCodes) {
  //     const success = await googleSheetsService.addAffiliateCode(codeData);
  //     console.log(`Added code ${codeData.code}: ${success}`);
  //   }

  //   return NextResponse.json({ 
  //     message: 'Small batch test completed!',
  //     codesAdded: testCodes.length
  //   });
  // } catch (error) {
  //   console.error('Small batch test error:', error);
  //   return NextResponse.json(
  //     { error: 'Small batch test failed', details: error instanceof Error ? error.message : 'Unknown error' },
  //     { status: 500 }
  //   );
  // }
}