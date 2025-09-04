"use client";
import { ReactNode } from "react";
import { useTransition } from "../../context/Transition_Context";

import NavBarDashboard from "../NavBarDashboard/NavBarDashboard";
import SideBarDashboard from "../SideBarDashboard/SideBarDashboard";
import Footer from "../Footer/Footer";
import Page_Transition from "../ui/Page_Transition";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isTransitioning } = useTransition();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed inset-0 bg-gradient-to-br from-teal-dark via-teal-medium to-teal -z-10"></div>
      <NavBarDashboard />
      <div className="flex flex-1 pt-16">
        <div className="hidden lg:block w-64 flex-shrink-0 relative z-20">
          <SideBarDashboard />
        </div>
        <main className="flex-1 min-h-screen relative overflow-hidden z-10">
          <div className="h-full p-0 lg:p-8 xl:p-12 relative z-10">
            <Page_Transition 
              isTransitioning={isTransitioning}
              className="w-full mx-auto h-full"
            >
              {children}
            </Page_Transition>
          </div>
        </main>
      </div>
      <Footer />
      
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .dashboard-content * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .dashboard-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        
        .dashboard-card:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .dashboard-card:active {
          transform: translateY(0) scale(1);
        }
        
        .nav-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-item:hover {
          transform: translateX(4px);
        }
        
        .nav-item.active {
          transform: translateX(8px);
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        * {
          scroll-behavior: smooth;
        }
        
        .page-transition {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .loading-overlay {
          backdrop-filter: blur(4px);
          background: rgba(0, 0, 0, 0.1);
        }
        
        .bounce {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout; 