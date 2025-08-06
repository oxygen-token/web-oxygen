"use client";
import { memo } from "react";
import { SocialSharingData } from "../types";
import { PiInstagramLogo, PiLinkedinLogo } from "react-icons/pi";

interface Social_Sharing_CardProps {
  data: SocialSharingData;
}

const Social_Sharing_Card = memo(({ data }: Social_Sharing_CardProps) => {
  return (
    <div className="dashboard-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-teal-500">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
        #SoyCarbonoNeutral
      </h3>
      
      <p className="text-xs text-gray-600 mb-3 sm:mb-4">
        ¡Compartí tu certificado en las redes sociales!
      </p>
      
      <div className="space-y-2 sm:space-y-3">
        {data.socialPlatforms.map((platform, index) => (
          <div key={index} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">
                  {data.certificateValue}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800">
                  {platform.action}
                </p>
              </div>
            </div>
            
            <button className="p-1 sm:p-1.5 text-gray-400 hover:text-teal-600 transition-colors">
              {platform.name === 'Instagram' ? (
                <PiInstagramLogo className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <PiLinkedinLogo className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

Social_Sharing_Card.displayName = 'Social_Sharing_Card';

export default Social_Sharing_Card; 