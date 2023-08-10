import "../styles/cardservice.css";
import "../styles/mainpage.css"
import { useState } from "react";
import Image from "next/image";

const CardService = ({ image, title, text, number, link }) => {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <Image src={image} width={200} height={300} style={{borderRadius: "40px"}} />
          <p>{title}</p>

         
    </div>
    <div className="flip-card-back">
      <h1>{number}</h1>
      <h2>{title}</h2>
      <p>{text}</p>
      <a href={link} target="_blank" rel="noreferrer" className="see-more-link">Ver más</a>
    </div>
  </div>
</div>
  );
};

export default CardService;