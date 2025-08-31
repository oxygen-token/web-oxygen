"use client";
import { memo } from "react";
import Image from "next/image";
import { ProjectData } from "../types";
import { PiArrowRight, PiFlag } from "react-icons/pi";

interface Project_CardProps {
  data: ProjectData;
}

const Project_Card = memo(({ data }: Project_CardProps) => {
  const handleCardClick = () => {
    window.open('/proyectos', '_blank');
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open('/proyectos', '_blank');
  };

  return (
    <div 
      className="project-card dashboard-card rounded-xl p-4 sm:p-5 flex items-center space-x-5 sm:space-x-6 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 border-white/30">
          <Image
            src={data.image}
            alt={data.name}
            width={150}
            height={150}
            className="w-full h-full object-cover"
            quality={100}
            priority={true}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
          />
        </div>
      </div>
      
      <div className="flex-1 space-y-1.5 sm:space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-white">
          {data.name}
        </h3>
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <PiFlag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <span className="text-sm sm:text-base text-white">
            {data.location}
          </span>
        </div>
        <p className="text-sm sm:text-base text-white">
          {data.price}
        </p>
      </div>
      
      <div className="flex-shrink-0">
        <button 
          className="p-1.5 sm:p-2 text-white hover:text-teal-200 transition-colors"
          onClick={handleArrowClick}
        >
          <PiArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
});

Project_Card.displayName = 'Project_Card';

export default Project_Card; 