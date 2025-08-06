"use client";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import Dashboard_Main from "../components/Dashboard/Dashboard_Main/Dashboard_Main";
import Animated_Page from "../components/ui/Animated_Page";

// Datos de ejemplo
const mockData = {
  metrics: [
    {
      title: "bonos de carbono",
      value: "X",
      icon: "/assets/images/imgTrees.jpg",
      description: "Créditos disponibles"
    },
    {
      title: "CO₂ absorbido",
      value: "X",
      icon: "/assets/images/forest.jpg",
      description: "Toneladas compensadas"
    },
    {
      title: "m² salvados",
      value: "X",
      icon: "/assets/images/imgTrees.jpg",
      description: "Área protegida"
    }
  ],
  projects: [
    {
      id: "1",
      name: "Las Araucarias",
      location: "Misiones",
      price: "$0.00 / tnCO2",
      image: "/assets/images/araucariasBuy.png",
      status: "active" as const
    },
    {
      id: "2",
      name: "Proyecto Salta",
      location: "Misiones",
      price: "$0.00 / tnCO2",
      image: "/assets/images/proyectoSalta.png",
      status: "active" as const
    }
  ],
  earnings: {
    total: "$000.00",
    chartData: [
      { month: "Mar", value: 10 },
      { month: "Abr", value: 15 },
      { month: "May", value: 20 },
      { month: "Jun", value: 25 },
      { month: "Jul", value: 30 },
      { month: "Ago", value: 35 },
      { month: "Sep", value: 40 },
      { month: "Oct", value: 35 },
      { month: "Nov", value: 30 },
      { month: "Dic", value: 25 }
    ]
  },
  footprint: {
    value: "0,00",
    unit: "tn CO₂",
    period: "año"
  },
  social: {
    certificateValue: "144 M²",
    socialPlatforms: [
      {
        name: "Instagram",
        icon: "instagram",
        action: "Publica en Instagram"
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        action: "Publica en LinkedIn"
      }
    ]
  }
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Animated_Page>
        <Dashboard_Main {...mockData} />
      </Animated_Page>
    </DashboardLayout>
  );
} 