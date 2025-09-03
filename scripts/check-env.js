console.log('🔍 Environment Check - Local:');
require('dotenv').config({ path: '.env.local' });
console.log('NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL || 'NOT SET');
console.log('NEXT_PUBLIC_ENV:', process.env.NEXT_PUBLIC_ENV || 'NOT SET');

console.log('\n🔍 Environment Check - Production:');
require('dotenv').config({ path: '.env.production' });
console.log('NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL || 'NOT SET');
console.log('NEXT_PUBLIC_ENV:', process.env.NEXT_PUBLIC_ENV || 'NOT SET');
