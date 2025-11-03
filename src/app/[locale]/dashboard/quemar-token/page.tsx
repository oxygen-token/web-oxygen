"use client";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import Animated_Page from "../../components/ui/Animated_Page";
import Burn_Panel from "../../components/Burn/Burn_Panel";
import Wallet_Tokens_Panel from "../../components/Burn/Wallet_Tokens_Panel";
import Certificates_Panel from "../../components/Burn/Certificates_Panel";
import Carbon_Neutral_Panel from "../../components/Burn/Carbon_Neutral_Panel";

export default function QuemarTokenPage() {
  return (
    <DashboardLayout>
      <Animated_Page>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-full">
          <div id="burn-panel" className="burn-panel bg-white/10 backdrop-blur-sm rounded-xl px-8 py-6 border border-white/20 h-full lg:col-span-4">
            <Burn_Panel />
          </div>
          
          <div className="flex flex-col gap-4 sm:gap-6 h-full lg:col-span-6">
            <div id="wallet-tokens-panel" className="wallet-tokens-panel bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-4 border border-white/20 h-1/3">
              <Wallet_Tokens_Panel />
            </div>
            
            <div id="certificates-panel" className="certificates-panel bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 h-1/3">
              <Certificates_Panel />
            </div>
            
            <div id="carbon-neutral-panel" className="carbon-neutral-panel bg-white/10 backdrop-blur-sm rounded-xl p-0 border border-white/20 h-1/3">
              <div className="p-2 sm:p-3 h-full flex flex-col">
                <Carbon_Neutral_Panel />
              </div>
            </div>
          </div>
        </div>
      </Animated_Page>
    </DashboardLayout>
  );
} 