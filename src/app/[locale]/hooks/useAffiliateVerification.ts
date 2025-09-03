import { useState, useEffect } from 'react';

export const useAffiliateVerification = () => {
  const [hasValidAffiliateCode, setHasValidAffiliateCode] = useState(false);

  useEffect(() => {
    // Check if user has a valid affiliate code in localStorage
    const checkAffiliateCode = () => {
      const affiliateCode = localStorage.getItem('affiliateCode');
      const isVerified = localStorage.getItem('affiliateVerified');
      
      if (affiliateCode && isVerified === 'true') {
        setHasValidAffiliateCode(true);
      } else {
        setHasValidAffiliateCode(false);
      }
    };

    checkAffiliateCode();
    
    // Listen for changes in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'affiliateCode' || e.key === 'affiliateVerified') {
        checkAffiliateCode();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setAffiliateVerified = (code: string) => {
    localStorage.setItem('affiliateCode', code);
    localStorage.setItem('affiliateVerified', 'true');
    setHasValidAffiliateCode(true);
  };

  const clearAffiliateCode = () => {
    localStorage.removeItem('affiliateCode');
    localStorage.removeItem('affiliateVerified');
    setHasValidAffiliateCode(false);
  };

  return {
    hasValidAffiliateCode,
    setAffiliateVerified,
    clearAffiliateCode
  };
};
