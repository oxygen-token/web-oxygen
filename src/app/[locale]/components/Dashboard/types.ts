export interface MetricData {
  title: string;
  value: string;
  icon: string;
  description: string;
}

export interface ProjectData {
  id: string;
  name: string;
  location: string;
  price: string;
  image: string;
  status: "active" | "inactive" | "completed";
}

export interface EarningsData {
  total: string;
  chartData: Array<{
    month: string;
    value: number;
  }>;
}

export interface CarbonFootprintData {
  value: string;
  unit: string;
  period: string;
}

export interface SocialSharingData {
  certificateValue: string;
  socialPlatforms: Array<{
    name: string;
    icon: string;
    action: string;
  }>;
} 