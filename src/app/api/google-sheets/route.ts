import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '../../../utils/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { affiliateCode, email, fullName, country, companyName, affiliateCodeType } = body;

    if (!affiliateCode || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: affiliateCode and email' },
        { status: 400 }
      );
    }

    const googleSheetsService = new GoogleSheetsService();
    
    // Determinar qué hoja usar según el tipo de código
    const sheetName = affiliateCodeType === 'code_lumen' ? 'Hoja 1' : 'Hoja 2';
    
    const success = await googleSheetsService.updateAffiliateCodeUsage(
      affiliateCode, 
      email, 
      sheetName
    );

    if (success) {
      return NextResponse.json({ 
        message: 'Affiliate code usage updated successfully',
        sheetUpdated: sheetName
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to update affiliate code usage' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Google Sheets API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
