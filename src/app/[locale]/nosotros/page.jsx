"use client";

//Componentes
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import TeamMember from "../components/TeamMember/TeamMember.js";
import Team_Carousel from "../components/TeamMember/Team_Carousel.js";

//Estilos
import "../../../styles/nosotros.css";
import "../../[locale]/globals.css";

//Assets
import picDante from "../../../../public/assets/images/team/team_sin_bg/Dante_sbg.png";
import picMatteo from "../../../../public/assets/images/team/team_sin_bg/Mateo_sbg.png";
import picFranco from "../../../../public/assets/images/team/team_sin_bg/Franco_sbg.png";
import picEmiliano from "../../../../public/assets/images/team/team_sin_bg/Emiliano_sbg.png";
import picConstanza from "../../../../public/assets/images/team/team_sin_bg/Constanza_sbg.png";
import picMalena from "../../../../public/assets/images/team/team_sin_bg/Malena_sbg.png";
import picNicolas from "../../../../public/assets/images/team/team_sin_bg/Nicolas_sbg.png";
import picLautaro from "../../../../public/assets/images/team/team_sin_bg/Lautaro_sbg.png";
import picAgustina from "../../../../public/assets/images/team/team_sin_bg/Agustina_sbg.png";
import picSalvador from "../../../../public/assets/images/team/team_sin_bg/Salva_sbg.png";
import picFelipe from "../../../../public/assets/images/team/team_sin_bg/Felipe_sbg.png";
import picRosa from "../../../../public/assets/images/rosaMoreno.png";
import picHector from "../../../../public/assets/images/hector.png";
import picTomas from "../../../../public/assets/images/team/team_sin_bg/Tomas_sbg.png";
import picRamon from "../../../../public/assets/images/team/team_sin_bg/Ramon_sbg.png";

import Head from "next/head"; 
import { useTranslations } from "next-intl";

const Nosotros = () => {
  const usIdioms = useTranslations("AboutUs");
  const teamIdioms = useTranslations("Team");

  const coreTeamMembers = [
    {
      name: "Dante Arola",
      picture: picDante,
      rol: "Project Manager",
      description: teamIdioms("text-dante"),
      linkLin: "https://www.linkedin.com/in/dante-arola-81456712a",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Matteo Palladino",
      picture: picMatteo,
      rol: "Conservation",
      description: teamIdioms("text-matteo"),
      linkLin: "",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Ramón Peña Agrest",
      picture: picRamon,
      rol: "Environmental Specialist",
      description: "Biologist specialized in forest monitoring and remote sensing applications. +2 years experience in native forest conservation projects across Argentina's protected areas and environmental consulting.",
      linkLin: "",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Tomás Vujanic",
      picture: picTomas,
      rol: "Environmental Consultant",
      description: "Environmental Science degree, Plant Physiology specialist. Currently Sustainability Analyst at the Ministry of Public Space and Urban Hygiene (Buenos Aires). 2+ years in urban infrastructure & project development.",
      linkLin: "",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Lautaro Martinez",
      picture: picLautaro,
      rol: "Relaciones publicas",
      description: teamIdioms("text-lautaro"),
      linkLin: "",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Agustina Dos Santos",
      picture: picAgustina,
      rol: "Community Manager",
      description: teamIdioms("text-agustina"),
      linkLin: "",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Nicolas Lopez",
      picture: picNicolas,
      rol: "Backend Developer",
      description: teamIdioms("text-nicolas"),
      linkLin: "https://www.linkedin.com/in/nicolas-lopez36920532/",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Salvador Sallent",
      picture: picSalvador,
      rol: "Comunicador",
      description: teamIdioms("text-salvador"),
      linkLin: "",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Felipe Issa",
      picture: picFelipe,
      rol: "Head of infrastructure",
      description: teamIdioms("text-felipe"),
      linkLin: "",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Ernestina Moreno",
      picture: picRosa,
      rol: "Indigenous Leader",
      description: teamIdioms("text-rosa"),
      linkLin: "",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Hector",
      picture: picHector,
      rol: "Indigenous Leader",
      description: teamIdioms("text-hector"),
      linkLin: "",
      linkIg: "",
      linkTw: ""
    }
  ];

  const colaboradoresMembers = [
    {
      name: "Malena Brun",
      picture: picMalena,
      rol: "UX/UI Design",
      description: teamIdioms("text-malena"),
      linkLin: "https://www.linkedin.com/in/malena-brun-313a8b266",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Constanza Guimaraez",
      picture: picConstanza,
      rol: "Frontend Engineer",
      description: teamIdioms("text-constanza"),
      linkLin: "https://www.linkedin.com/in/constanza-guimaraez",
      linkIg: "",
      linkTw: ""
    }
  ];

  const advisorsMembers = [
    {
      name: "Franco Ammaturo",
      picture: picFranco,
      rol: "Head of Growth",
      description: teamIdioms("text-franco"),
      linkLin: "https://www.linkedin.com/in/franco-ammaturo-208712192",
      linkIg: "",
      linkTw: ""
    },
    {
      name: "Emiliano Ezcurra",
      picture: picEmiliano,
      rol: "Conservation Advisor",
      description: teamIdioms("text-emiliano"),
      linkLin: "https://www.linkedin.com/in/emiliano-ezcurra-3a26b720",
      linkIg: "",
      linkTw: ""
    }
  ];

  return (
    <>
      <Head>
        <title>Oxygen Token</title>
        <meta name="description" content="Oxygen-Token" />
      </Head>
      <Navbar />
      <section className="thisIsOxygen">
        <h1>{usIdioms("title")}</h1>
        <div className="misionVision">
          <div className="mision">
            <h2>{usIdioms("mision-title")}</h2>
            <p>{usIdioms("mision-text")}</p>
          </div>
          <div className="vision">
            <h2>{usIdioms("vision-title")}</h2>
            <p>{usIdioms("vision-text")}</p>
          </div>
        </div>
      </section>

      <section className="team">
        <Team_Carousel 
          teamMembers={coreTeamMembers} 
          sectionTitle="Core Team" 
        />
        
        <Team_Carousel 
          teamMembers={colaboradoresMembers} 
          sectionTitle="Colaboradores" 
        />
        
        <Team_Carousel 
          teamMembers={advisorsMembers} 
          sectionTitle="Advisors" 
        />
        
        <div className="joinUs">
          <h3>{usIdioms("joinus-title")}</h3>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Nosotros;
