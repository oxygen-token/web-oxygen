import "./project.css";
import Image from "next/image";

const Project = ({ name, picture, description, buyCard, btnLink, btnText }) => {
  return (
    <>
      <div className={buyCard ? "projectCardBuy" : "projectCard"}>
        <Image src={picture} alt={name} className="projectImage" />
        <div className={buyCard ? "projectTextBuy" : "projectText"}>
          <h5 className="projectTitle">{name}</h5>
          <div className="projectDescription">
            <p>{description}</p>
          </div>
          <div className={buyCard ? "buyTokensBtnContainer" : ""}>
            <a
              target="_blank"
              className={buyCard ? "buyTokensBtn" : "projectButton"}
              href={btnLink}
            >
              {btnText}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Project;
