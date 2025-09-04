import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching affiliate codes from backend...');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_AFFILIATE_BACKEND_URL || 'http://localhost:10001'}/allAffiliateCodes`);
    if (!response.ok) {
      throw new Error(`Failed to fetch affiliate codes: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.success || !data.data.codes) {
      throw new Error('Invalid response format from backend');
    }

    const allCodes = data.data.codes;
    const sixDigitCodes = allCodes.filter((code: any) => 
      code.code && code.code.length === 6 && /^[a-zA-Z0-9]{6}$/.test(code.code)
    );

    console.log(`Total codes: ${allCodes.length}`);
    console.log(`Six-digit codes: ${sixDigitCodes.length}`);
    console.log('First 5 codes:', sixDigitCodes.slice(0, 5).map((c: any) => c.code));

    return NextResponse.json({
      message: 'Debug successful',
      totalCodes: allCodes.length,
      sixDigitCodes: sixDigitCodes.length,
      firstFiveCodes: sixDigitCodes.slice(0, 5).map((c: any) => c.code),
      sampleCode: sixDigitCodes[0]
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error.message },
      { status: 500 }
    );
  }
}
