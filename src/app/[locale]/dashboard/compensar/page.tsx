"use client";
import { useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import Animated_Page from "../../components/ui/Animated_Page";
import Project_Card from "../../components/Compensate/Project_Card";
import Argentina_Map, { Argentina_MapHandle, projects } from "../../components/Compensate/Argentina_Map";

export default function CompensarPage() {
  const mapRef = useRef<Argentina_MapHandle>(null);

  const handleProjectClick = (index: number) => {
    if (mapRef.current && projects[index]) {
      mapRef.current.zoomToProject(projects[index].coordinates);
    }
  };

  return (
    <DashboardLayout>
      <Animated_Page>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-full">
          <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-6 h-full">
            <h1 className="text-white font-bold text-lg sm:text-xl">Compensa</h1>
            
            <div className="flex flex-col gap-4 sm:gap-6 flex-1">
              <div id="compensate-block-1" className="rounded-xl overflow-hidden border border-white/20 h-1/2">
                <Project_Card
                  image="/assets/images/Proyecto_1.png"
                  name="Las Araucarias"
                  location="Misiones"
                  price="USD 00,00"
                  onClick={() => handleProjectClick(0)}
                />
              </div>
              
              <div id="compensate-block-2" className="rounded-xl overflow-hidden border border-white/20 h-1/2">
                <Project_Card
                  image="/assets/images/proyectoSalta.png"
                  name="Proyecto Salta"
                  location="Salta"
                  price="USD 00,00"
                  onClick={() => handleProjectClick(1)}
                />
              </div>
            </div>
          </div>
          
          <div id="compensate-panel" className="compensate-panel rounded-xl overflow-hidden border border-white/20 h-full lg:col-span-4">
            <Argentina_Map ref={mapRef} />
          </div>
        </div>
      </Animated_Page>
    </DashboardLayout>
  );
} 