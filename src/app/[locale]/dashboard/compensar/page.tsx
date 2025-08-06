"use client";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import Animated_Page from "../../components/ui/Animated_Page";

export default function CompensarPage() {
  return (
    <DashboardLayout>
      <Animated_Page>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Compensar
            </h1>
            <p className="text-white/70 text-lg">
              Página en desarrollo
            </p>
          </div>
        </div>
      </Animated_Page>
    </DashboardLayout>
  );
} 