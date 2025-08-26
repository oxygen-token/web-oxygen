// Components
import Footer from "../Footer/Footer";
import Partnerships from "../Partnerships/Partnerships";

// Styles
import "./mainpage.css";
import "../../globals.css";

// Sections
import { PreLanding } from "./PreLanding";
import { Hero } from "./Hero";
import { Services } from "./Services";
import { Tokens } from "./Tokens";
import { Progress } from "./Progress";
import { Video } from "./Video";
import { Quote } from "./Quote";
import { BackgroundVideo } from "./BackgroundVideo";

const MainPage = () => {
  return (
    <>
      <PreLanding />

      <BackgroundVideo />

      <Hero />
      <Services />
      <Tokens />
      <Progress />
      <Video />
      <Partnerships />
      <Quote />
      
      <Footer />
    </>
  );
};

export default MainPage;
