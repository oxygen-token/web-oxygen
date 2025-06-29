import Image from "next/image";
import "../MainPage/mainpage.css"
import tokenv1 from "../../../../../public/assets/images/tokenv1.png"

const TokensNFT = () => {
  return (
    <Image src={tokenv1}  alt="logo" className="token" /> 
  );
};

export default TokensNFT;