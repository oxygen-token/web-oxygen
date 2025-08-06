"use client";
import { memo } from "react";
import Project_Card from "./Project_Card";
import Carbon_Footprint_Card from "../Bottom_Row/Carbon_Footprint_Card";
import { ProjectData, CarbonFootprintData } from "../types";

interface Projects_RowProps {
  projects: ProjectData[];
  footprint: CarbonFootprintData;
}

const Projects_Row = memo(({ projects, footprint }: Projects_RowProps) => {
  return (
    <div className="mb-20 sm:mb-24 lg:mb-28">
      <h2 className="text-base sm:text-lg font-bold text-white mb-8 sm:mb-10">
        Proyectos vigentes
      </h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 sm:gap-16 lg:gap-20">
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <div className="relative">
              <Project_Card data={projects[0]} />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4/5 bg-gray-400/30"></div>
            </div>
            <div className="relative">
              <Project_Card data={projects[1]} />
            </div>
          </div>
        </div>
        
        <div className="xl:col-span-1">
          <Carbon_Footprint_Card data={footprint} />
        </div>
      </div>
    </div>
  );
});

Projects_Row.displayName = 'Projects_Row';

export default Projects_Row; 