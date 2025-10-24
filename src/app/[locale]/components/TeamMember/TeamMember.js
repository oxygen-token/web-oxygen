import Image from "next/image";
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import "./teammember.css";

const TeamMember = ({
  name,
  picture,
  rol,
  description,
  linkLin,
  linkIg,
  linkTw,
  isSelected = false,
  isClicked = false,
}) => {
  return (
    <>
      <div className={`teamMember ${isSelected ? 'selected' : ''} ${isClicked ? 'clicked' : ''}`}>
        <div className="teamMemberImageContainer">
          <Image
            className="teamMemberPicture"
            src={picture}
            alt="imagen miembro del equipo"
            fill
          ></Image>
        </div>
        <div className="teamMemberInfo">
          <h3 className="teamMemberName">{name}</h3>
          <h5 className="teamMemberRole">{rol}</h5>
        </div>
        <div className="teamMemberHover">
          <div className="teamMemberDescription">
            <p>{description}</p>
          </div>
          <div className="teamMemberContact">
            <a href={linkLin} target="_blank" rel="noopener noreferrer">
              <div className="logoContact">
                <FaLinkedin size={20} />
              </div>
            </a>
            <a href={linkIg} target="_blank" rel="noopener noreferrer">
              <div className="logoContact">
                <FaInstagram size={20} />
              </div>
            </a>
            <a href={linkTw} target="_blank" rel="noopener noreferrer">
              <div className="logoContact">
                <FaTwitter size={20} />
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamMember;
