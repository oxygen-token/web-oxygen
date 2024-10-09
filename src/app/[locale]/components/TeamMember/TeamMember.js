import Image from "next/image";
import logoInstagram from "../../../../../public/assets/logos/logoInstagram.png";
import logoLinkedin from "../../../../../public/assets/logos/logoLinkedin.png";
import logoTwitter from "../../../../../public/assets/logos/logoTwitter.png";
import "./teammember.css";

const TeamMember = ({
  name,
  picture,
  rol,
  description,
  linkLin,
  linkIg,
  linkTw,
}) => {
  return (
    <>
      <div className="teamMember">
        <Image
          className="teamMemberPicture"
          src={picture}
          alt="imagen miembro del equipo"
        ></Image>
        <div className="teamMemberDescription">
          <h3 className="teamMemberName">{name}</h3>
          <h5>{rol}</h5>
          <p>{description}</p>
        </div>
        <div className="teamMemberContact">
          <a href={linkLin}>
            <Image
              className="logoContact"
              src={logoLinkedin}
              alt="Linkedin"
            ></Image>
          </a>
          <a href={linkIg}>
            <Image
              className="logoContact"
              src={logoInstagram}
              alt="Instagram"
            ></Image>
          </a>
          <a href={linkTw}>
            <Image
              className="logoContact"
              src={logoTwitter}
              alt="Twitter"
            ></Image>
          </a>
        </div>
      </div>
    </>
  );
};

export default TeamMember;
