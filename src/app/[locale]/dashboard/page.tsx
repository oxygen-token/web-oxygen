"use client";
import { useTranslations } from "next-intl";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import Dashboard_Main from "../components/Dashboard/Dashboard_Main/Dashboard_Main";
import Animated_Page from "../components/ui/Animated_Page";
import AuthLoading from "../components/ui/Auth_Loading";

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
      value: "5",
      icon: "/assets/images/imgTrees.jpg",
      description: "Área protegida"
    }
  ],
  projects: [
    {
      id: "1",
      name: "La Florencia",
      location: "Formosa",
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
    total: "$--,---",
    chartData: [
      { month: "Ene", value: 1500 },
      { month: "Feb", value: 1800 },
      { month: "Mar", value: 2200 },
      { month: "Abr", value: 1900 },
      { month: "May", value: 2800 },
      { month: "Jun", value: 2400 },
      { month: "Jul", value: 3200 },
      { month: "Ago", value: 3800 },
      { month: "Sep", value: 4200 },
      { month: "Oct", value: 4800 },
      { month: "Nov", value: 5200 },
      { month: "Dic", value: 5800 }
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
  const t = useTranslations("Dashboard");

  const mockData = {
    metrics: [
      {
        title: t("metrics.carbonCredits"),
        value: "X",
        icon: "/assets/images/imgTrees.jpg",
        description: t("metrics.carbonCreditsDesc")
      },
      {
        title: t("metrics.co2Absorbed"),
        value: "X",
        icon: "/assets/images/forest.jpg",
        description: t("metrics.co2AbsorbedDesc")
      },
      {
        title: t("metrics.areaSaved"),
        value: "5",
        icon: "/assets/images/imgTrees.jpg",
        description: t("metrics.areaSavedDesc")
      }
    ],
    projects: [
      {
        id: "1",
        name: "La Florencia",
        location: "Formosa",
        price: "$0.00 / tnCO2",
        image: "/assets/images/araucariasBuy.png",
        status: "active" as const
      },
      {
        id: "2",
        name: t("projects.saltaProject"),
        location: "Misiones",
        price: "$0.00 / tnCO2",
        image: "/assets/images/proyectoSalta.png",
        status: "active" as const
      }
    ],
    earnings: {
      total: "$--,---",
      chartData: [
        { month: t("months.jan"), value: 1500 },
        { month: t("months.feb"), value: 1800 },
        { month: t("months.mar"), value: 2200 },
        { month: t("months.apr"), value: 1900 },
        { month: t("months.may"), value: 2800 },
        { month: t("months.jun"), value: 2400 },
        { month: t("months.jul"), value: 3200 },
        { month: t("months.aug"), value: 3800 },
        { month: t("months.sep"), value: 4200 },
        { month: t("months.oct"), value: 4800 },
        { month: t("months.nov"), value: 5200 },
        { month: t("months.dec"), value: 5800 }
      ]
    },
    footprint: {
      value: "0,00",
      unit: t("footprint.unit"),
      period: t("footprint.period")
    },
    social: {
      certificateValue: "144 M²",
      socialPlatforms: [
        {
          name: "Instagram",
          icon: "instagram",
          action: t("social.instagramAction")
        },
        {
          name: "LinkedIn",
          icon: "linkedin",
          action: t("social.linkedinAction")
        }
      ]
    }
  };

  return (
    <AuthLoading requireAuth={true}>
      <DashboardLayout>
        <Animated_Page>
          <Dashboard_Main {...mockData} />
        </Animated_Page>
      </DashboardLayout>
    </AuthLoading>
  );
} 