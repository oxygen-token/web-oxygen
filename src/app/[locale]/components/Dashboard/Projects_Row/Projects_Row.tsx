"use client";
import { memo } from "react";
import { useTranslations } from "next-intl";
import Project_Card from "./Project_Card";
import Carbon_Footprint_Card from "../Bottom_Row/Carbon_Footprint_Card";
import { ProjectData, CarbonFootprintData } from "../types";

interface Projects_RowProps {
  projects: ProjectData[];
  footprint: CarbonFootprintData;
}

const Projects_Row = memo(({ projects, footprint }: Projects_RowProps) => {
  const t = useTranslations("Dashboard");
  
  return (
    <div className="projects-section mb-8 sm:mb-8 lg:mb-20 xl:mb-24">
      <h2 className="text-base sm:text-lg font-bold text-white">
        {t("sections.currentProjects")}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-10 xl:gap-16 min-h-[250px]">
        <div className="relative max-w-md mx-auto w-full flex items-center justify-center">
          <Project_Card data={projects[0]} />
        </div>
        <div className="h-full max-w-md mx-auto w-full flex items-center justify-center">
          <Carbon_Footprint_Card data={footprint} />
        </div>
      </div>
    </div>
  );
});

Projects_Row.displayName = 'Projects_Row';

export default Projects_Row; 