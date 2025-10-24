"use client";
import { useState, useRef, useEffect } from "react";
import TeamMember from "./TeamMember";

const Team_Carousel = ({ teamMembers, sectionTitle }) => {
  const [selectedMember, setSelectedMember] = useState(0);
  const [clickedMember, setClickedMember] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMemberClick = (index) => {
    // Si ya está clickeado, deseleccionar
    if (clickedMember === index) {
      setClickedMember(null);
      // Al deseleccionar, volver a la selección visual automática
      setSelectedMember(index);
    } else {
      setClickedMember(index);
      // Al clickear, también actualizar la selección visual
      setSelectedMember(index);
    }
    
    if (isMobile && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cards = container.querySelectorAll('.teamCarouselCard');
      if (cards[index]) {
        const cardElement = cards[index];
        const cardLeft = cardElement.offsetLeft;
        const cardWidth = cardElement.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
        
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  };

  const handleContainerClick = (e) => {
    // Solo cerrar la selección si no se clickeó en una card
    if (!e.target.closest('.teamCarouselCard')) {
      setClickedMember(null);
    }
  };

  // Asegurar que siempre haya uno seleccionado al cargar
  useEffect(() => {
    if (isMobile && selectedMember === null && teamMembers.length > 0) {
      setSelectedMember(0);
    }
  }, [isMobile, teamMembers.length, selectedMember]);

  const handleScroll = () => {
    if (isMobile && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cards = container.querySelectorAll('.teamCarouselCard');
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;
      
      // Encontrar la card más cercana al centro
      let closestIndex = 0;
      let minDistance = Infinity;
      
      cards.forEach((card, index) => {
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const cardCenter = cardLeft + (cardWidth / 2);
        const containerCenter = scrollLeft + (containerWidth / 2);
        const distance = Math.abs(cardCenter - containerCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      
      // Si hay uno clickeado y el scroll cambia a una posición diferente, deseleccionar
      if (clickedMember !== null && closestIndex !== clickedMember) {
        setClickedMember(null);
      }
      
      // Actualizar la selección visual - solo si no hay ninguno clickeado
      if (clickedMember === null) {
        setSelectedMember(closestIndex);
      }
    }
  };

  if (!isMobile) {
    return (
      <div className="teamSection">
        <h3 className="teamSectionTitle">{sectionTitle}</h3>
        <div className="teamCards">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              {...member}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="teamSection" onClick={handleContainerClick}>
      <h3 className="teamSectionTitle">{sectionTitle}</h3>
      <div 
        className="teamCarousel"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <div className="teamCarouselContent">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`teamCarouselCard ${selectedMember === index ? 'selected' : 'not-selected'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleMemberClick(index);
              }}
            >
              <TeamMember
                {...member}
                isSelected={selectedMember === index}
                isClicked={clickedMember === index}
              />
            </div>
          ))}
        </div>
      </div>
      {isMobile && (
        <div className="paginationDots">
          {teamMembers.map((_, index) => (
            <div
              key={index}
              className={`paginationDot ${selectedMember === index ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleMemberClick(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Team_Carousel;
