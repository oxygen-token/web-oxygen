"use client";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import Animated_Page from "../../components/ui/Animated_Page";
import Exchange_Panel from "../../components/Exchange/Exchange_Panel";
import Currency_Flow_Panel from "../../components/Exchange/Currency_Flow_Panel";
import Exchange_History_Panel from "../../components/Exchange/Exchange_History_Panel";

export default function ExchangePage() {
  return (
    <DashboardLayout>
      <Animated_Page>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-full">
          <div id="exchange-panel" className="exchange-panel bg-white/10 backdrop-blur-sm rounded-xl px-8 py-6 border border-white/20 h-full lg:col-span-4">
            <Exchange_Panel />
          </div>
          
          <div className="flex flex-col gap-4 sm:gap-6 h-full lg:col-span-6">
            <div id="currency-flow-panel" className="currency-flow-panel bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 h-1/2">
              <Currency_Flow_Panel />
            </div>
            
            <div id="exchange-history-panel" className="exchange-history-panel bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 h-1/2">
              <Exchange_History_Panel />
            </div>
          </div>
        </div>
      </Animated_Page>
    </DashboardLayout>
  );
}

