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
    <div className="projects-section mb-6 sm:mb-8 lg:mb-20 xl:mb-24">
      <h2 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 lg:mb-8 xl:mb-10">
        Proyectos vigentes
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-10 xl:gap-16 min-h-[250px]">
        <div className="relative">
          <Project_Card data={projects[0]} />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4/5 bg-gray-400/30"></div>
        </div>
        <div className="relative">
          {/* Empty space - project removed */}
        </div>
        <div className="h-full">
          <Carbon_Footprint_Card data={footprint} />
        </div>
      </div>
    </div>
  );
});

Projects_Row.displayName = 'Projects_Row';

export default Projects_Row; 