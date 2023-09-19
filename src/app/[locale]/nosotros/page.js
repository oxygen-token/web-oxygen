"use client";

//Componentes
import Navbar from "../components/Navbar/Navbar.js";
import Footer from "../components/Footer/Footer.js";
import TeamMember from "../components/TeamMember/TeamMember.js";

//Estilos
import "../../../styles/nosotros.css"
import "../../[locale]/globals.css"

//Assets
import picDante from "../../../../public/assets/images/dante.png"
import picMatteo from "../../../../public/assets/images/matteo.png"
import picFranco from "../../../../public/assets/images/franco.png"
import picEmiliano from "../../../../public/assets/images/emiliano.png"
import picGustavo from "../../../../public/assets/images/gustavo.png"
import picGuido from "../../../../public/assets/images/guido.png"
import picConstanza from "../../../../public/assets/images/constanza.png"
import picMalena from "../../../../public/assets/images/malena.png"


import Head from "next/head";
import { useTranslations } from "next-intl";


const Nosotros = () =>{
    const usIdioms = useTranslations('AboutUs');
    const teamIdioms = useTranslations('Team');

    return (
        <>
        <Head>
        <title>Oxygen Token</title>
        <meta name="description" content="Oxygen-Token"/>
      </Head>
        <Navbar/>
        <section className="thisIsOxygen">
            <h1>{usIdioms('title')}</h1>
            <div className="misionVision">
                <div className="mision">
                    <h2>{usIdioms('mision-title')}</h2>
                    <p>{usIdioms('mision-text')}</p>
                </div>
                <div className="vision">
                    <h2>{usIdioms('vision-title')}</h2>
                    <p>{usIdioms('vision-text')}</p>
                </div>
            </div>
        </section>

        <section className="team">
            <h2>Oxygen Team</h2>
            <div className="teamCards">
                <TeamMember
                    name= "Dante Arola"
                    picture={picDante}
                    rol="Project Manager"
                    description={teamIdioms('text-dante')}
                    linkLin= "https://www.linkedin.com/in/dante-arola-81456712a" />
                <TeamMember
                    name= "Matteo Paladino"
                    picture={picMatteo}
                    rol="Conservation"
                    description={teamIdioms('text-matteo')}
                    linkLin=""/>
                <TeamMember
                    name= "Franco Ammaturo"
                    picture={picFranco}
                    rol="Head of Growth"
                    description={teamIdioms('text-franco')} 
                    linkLin="https://www.linkedin.com/in/franco-ammaturo-208712192"/>
                 <TeamMember
                    name= "Emiliano Ezcurra"
                    picture={picEmiliano}
                    rol="Conservation Advisor"
                    description={teamIdioms('text-emiliano')} 
                    linkLin="https://www.linkedin.com/in/emiliano-ezcurra-3a26b720"/>
                 <TeamMember
                    name= "Gustavo Ammaturo"
                    picture={picGustavo}
                    rol="Angel + Advisor"
                    description={teamIdioms('text-gustavo')} 
                    linkLin="  https://www.linkedin.com/in/gustavo-ammaturo-63561450"/>
                <TeamMember
                    name= "Guido Pino"
                    picture={picGuido}
                    rol="Fullstack Engineer"
                    description={teamIdioms('text-guido')} 
                    linkLin="  https://www.linkedin.com/in/guidopino"/>
                <TeamMember
                    name= "Constanza Guimaraez"
                    picture={picConstanza}
                    rol="Frontend Engineer"
                    description={teamIdioms('text-constanza')} 
                    linkLin="  https://www.linkedin.com/in/constanza-guimaraez"/>
                <TeamMember
                    name= "Malena Brun"
                    picture={picMalena}
                    rol="Design"
                    description= " "
                    linkLin="https://www.linkedin.com/in/malena-brun-313a8b266"/>
               
                
            </div>
            <div className="joinUs">
                <h3>{usIdioms('joinus-title')}</h3>
            </div>
            <div className="line"></div>
        </section>

        <section className="tokenomics">
            <h2>{usIdioms('tokenomics-title')}</h2>
        </section>
        <Footer/>
        
        </>
    )

}

export default Nosotros