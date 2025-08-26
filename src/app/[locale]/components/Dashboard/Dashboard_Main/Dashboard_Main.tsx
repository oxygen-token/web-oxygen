"use client";
import { memo } from "react";
import Metrics_Row from "../Metrics_Row/Metrics_Row";
import Projects_Row from "../Projects_Row/Projects_Row";
import Bottom_Row from "../Bottom_Row/Bottom_Row";
import Dashboard_Tour from "../Dashboard_Tour/Dashboard_Tour";
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
    <>
      <Dashboard_Tour />
      <div className="dashboard-content space-y-2 sm:space-y-3 lg:space-y-6 xl:space-y-8 p-2 sm:p-3 lg:p-0 xl:p-0">
        <Metrics_Row data={metrics} />
        <Projects_Row projects={projects} footprint={footprint} />
        <Bottom_Row earnings={earnings} social={social} />
      </div>
    </>
  );
});

Dashboard_Main.displayName = 'Dashboard_Main';

export default Dashboard_Main; 