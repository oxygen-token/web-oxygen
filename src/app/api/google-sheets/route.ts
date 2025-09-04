import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '../../../utils/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { affiliateCode, email } = body;

    if (!affiliateCode || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: affiliateCode and email' },
        { status: 400 }
      );
    }

    const googleSheetsService = new GoogleSheetsService();
    
    const success = await googleSheetsService.updateAffiliateCodeUsage(affiliateCode, email);

    if (success) {
      return NextResponse.json({ message: 'Affiliate code usage updated successfully' });
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
