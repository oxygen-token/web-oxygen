import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '../../../utils/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Missing required field: code' },
        { status: 400 }
      );
    }

    const googleSheetsService = new GoogleSheetsService();
    
    const result = await googleSheetsService.verifyAffiliateCode(code);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Affiliate code verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
