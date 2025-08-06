"use client";
import { memo } from "react";
import Metric_Card from "./Metric_Card";
import { MetricData } from "../types";

interface Metrics_RowProps {
  data: MetricData[];
}

const Metrics_Row = memo(({ data }: Metrics_RowProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 lg:gap-20">
      {data.map((metric, index) => (
        <Metric_Card key={index} data={metric} />
      ))}
    </div>
  );
});

Metrics_Row.displayName = 'Metrics_Row';

export default Metrics_Row; 