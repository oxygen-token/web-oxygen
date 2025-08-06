"use client";
import { memo } from "react";
import Metrics_Row from "../Metrics_Row/Metrics_Row";
import Projects_Row from "../Projects_Row/Projects_Row";
import Bottom_Row from "../Bottom_Row/Bottom_Row";
import { 
  MetricData, 
  ProjectData, 
  EarningsData, 
  CarbonFootprintData, 
  SocialSharingData 
} from "../types";

interface Dashboard_MainProps {
  metrics: MetricData[];
  projects: ProjectData[];
  earnings: EarningsData;
  footprint: CarbonFootprintData;
  social: SocialSharingData;
}

const Dashboard_Main = memo(({ 
  metrics, 
  projects, 
  earnings, 
  footprint, 
  social 
}: Dashboard_MainProps) => {
  return (
    <div className="dashboard-content space-y-4 sm:space-y-6 lg:space-y-8">
      <Metrics_Row data={metrics} />
      <Projects_Row projects={projects} footprint={footprint} />
      <Bottom_Row earnings={earnings} social={social} />
    </div>
  );
});

Dashboard_Main.displayName = 'Dashboard_Main';

export default Dashboard_Main; 