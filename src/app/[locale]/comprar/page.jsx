"use client";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "../../../styles/comprar.css";
import "../globals.css";
import { useTranslations } from "next-intl";
import Image from "next/image.js";
import tokenImg from "../../../../public/assets/images/tokenv1.png";
import Project from "../components/Project/Project.js";
import laFlorenciaPic from "../../../../public/assets/images/laFlorenciaBuy.png";
import araucariasPic from "../../../../public/assets/images/araucariasBuy.png";
// ..
const Comprar = () => {
  const buyIdioms = useTranslations("Buy");
  const projectIdioms = useTranslations("Project");
  return (
    <>
      <Navbar />
      <section className="buyTokens">
        <div className="buyTokensLayout">
          <h1>{buyIdioms("title")}</h1>
          <a className="buyTokensBtn" href="#buyNow">
            {buyIdioms("btn")}
          </a>
        </div>
        <div className="buyNow" id="buyNow">
          <h4>{buyIdioms("buy-now-title-1")}</h4>
          <h2>{buyIdioms("buy-now-title-2")}</h2>
          <div className="tokensDisplay">
            <div className="tokenAlert">
              <Image src={tokenImg} alt="token" className="tokenAlertImg" />
              <h3>{buyIdioms("token-alert-title")}</h3>
              <p>{buyIdioms("token-alert-text")}</p>
            </div>
            <div className="tokensContainer">
              <Project
                name="LA FLORENCIA"
                picture={laFlorenciaPic}
                description={projectIdioms("laFlorencia-text")}
                buyCard={true}
                btnText={buyIdioms("btn")}
              />
              <Project
                name="LAS ARAUCARIAS"
                picture={araucariasPic}
                description={projectIdioms("laFlorencia-text")}
                buyCard={true}
                btnText={buyIdioms("btn")}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Comprar;
