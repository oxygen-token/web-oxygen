import React, { useState, useEffect } from "react";
import "./sliderComp.css"

function SliderComp(props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const proyectos = props.proyectos;
  const automatico = props.automatico || false;

  /*Uso de botones cuando no está en automático*/
  const handlePrev = () => {
    setCurrentIndex(
      currentIndex === 0 ? proyectos.length - 1 : currentIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(
      currentIndex === proyectos.length - 1 ? 0 : currentIndex + 1
    );
  };

  /*Función automático*/

  useEffect(() => {
    let intervalId;

    if(automatico){
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === proyectos.length -1 ? 0: prevIndex+1
        );
      },5000);
    }

    return () => {
      clearInterval(intervalId);
    };
  },[automatico, proyectos.length]);


  return proyectos.length > 0 ? (
    <div className="sliderComp">
      <button className={props.estilo ? "prev2" : "prev1"} onClick={handlePrev}>
  ←
</button>
      {proyectos[currentIndex]}
      <button className={props.estilo ? "next2" : "next1"}onClick={handleNext}>
        →
      </button>
    </div>
  ) : (
    <h2>No hay nada para mostrar... por ahora</h2>
  );
}

export default SliderComp;