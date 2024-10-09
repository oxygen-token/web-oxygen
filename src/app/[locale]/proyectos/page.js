"use client";

//Components
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Project from "../components/Project/Project.js";

//Styles
import "../../../styles/proyecto.css";
import "../../[locale]/globals.css";

//Files
import mapArg from "../../../../public/assets/images/mapaArg.png";
import laFlorenciaPic from "../../../../public/assets/images/laFlorencia.png";
import araucariasPic from "../../../../public/assets/images/proyectoSalta.png";

import { useTranslations } from "next-intl";
import Image from "next/image.js";

import dynamic from 'next/dynamic';

const MapWithMarkers = dynamic(() => import('../components/Map/MapWithMarkers'), { ssr: false });
const MapBackground = dynamic(() => import('../components/Map/MapBackground'), { ssr: false });

const Proyectos = () => {
  const projectIdioms = useTranslations("Project");
  return (
    <>
      <Navbar />
      <section className="project">
        <div className="projectHeader">
          <div className="mapBackground">
            <MapBackground />
          </div>
          <h1>
            {projectIdioms("title-1")} <br />
            {projectIdioms("title-2")}
          </h1>
          <a href="#map" className="projectMainBtn">
            {projectIdioms("button-projects")}
          </a>
        </div>
        <div className="projectMap" id="map">
          <h3>{projectIdioms("map-title-1")}</h3>
          <h2>{projectIdioms("map-title-2")}</h2>
          <div className="projectList">
            <MapWithMarkers />
            <Project
              name="LA FLORENCIA"
              picture={laFlorenciaPic}
              description={projectIdioms("laFlorencia-text")}
              btnText={projectIdioms("see-map")}
              btnLink="https://earth.google.com/web/@-24.20128471,-61.90184657,178.65665461a,50698.09743483d,30y,0h,0t,0r/data=OgMKATA"
            />
            {/* <Project
              name="LAS ARAUCARIAS"
              picture={araucariasPic}
              description={projectIdioms("laFlorencia-text")}
              btnText={projectIdioms("see-map")}
              btnLink="https://earth.google.com/web/@-24.20128471,-61.90184657,178.65665461a,50698.09743483d,30y,0h,0t,0r/data=OgMKATA"
            /> */}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Proyectos;
