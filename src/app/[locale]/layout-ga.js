"use client"
import TagManager, {TagManagerArgs} from 'react-gtm-module';
import { useEffect } from 'react';

export default function RootLayout() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";

  const tagManagerArgs = {
    gtmId: gtmId,
  };

  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);


  return (console.log("Running")
  )
} 