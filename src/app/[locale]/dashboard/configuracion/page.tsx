"use client";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import Animated_Page from "../../components/ui/Animated_Page";
import Profile_Card from "../../components/Settings/Profile_Card";
import Edit_Profile_Form from "../../components/Settings/Edit_Profile_Form";

export default function ConfiguracionPage() {
  return (
    <DashboardLayout>
      <Animated_Page>
        <div className="flex flex-col gap-6 h-full min-h-0 items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 w-full max-w-[1400px]">
            <div className="lg:col-span-4 flex items-center justify-center">
              <Profile_Card />
            </div>
            
            <div className="lg:col-span-6 flex items-center justify-center">
              <Edit_Profile_Form />
            </div>
          </div>
        </div>
      </Animated_Page>
    </DashboardLayout>
  );
} 