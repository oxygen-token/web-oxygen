"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";

interface Blog_Post_Props {
  id: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  comments: number;
  likes: number;
}

export default function Blog_Post({
  id,
  image,
  title,
  excerpt,
  author,
  date,
  readTime,
  views,
  comments,
  likes: initialLikes,
}: Blog_Post_Props) {
  const t = useTranslations("Blog");
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <article className="group flex flex-col lg:flex-row gap-6 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-500 ease-out cursor-pointer lg:hover:scale-[1.02] lg:hover:-translate-y-1 lg:hover:shadow-2xl lg:hover:shadow-black/20 lg:hover:border-white/30">
      <div className="lg:w-1/3">
        <div className="relative h-48 lg:h-64 w-full rounded-lg overflow-hidden lg:transition-transform lg:duration-500 lg:ease-out lg:group-hover:scale-105">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover lg:transition-transform lg:duration-500 lg:ease-out lg:group-hover:scale-110"
          />
        </div>
      </div>
      
      <div className="lg:w-2/3 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
            <span>{date}</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3 hover:text-teal-300 transition-colors duration-200">
            {title}
          </h3>
          
          <p className="text-white/80 leading-relaxed mb-4">
            {excerpt}
          </p>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-white/50">
          <span>{views} {t("views")}</span>
          <span>{comments} {t("comments")}</span>
          <div 
            className="flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                if (isLiked) {
                  setLikes(prev => prev - 1);
                  setIsLiked(false);
                } else {
                  setLikes(prev => prev + 1);
                  setIsLiked(true);
                }
                setTimeout(() => setIsAnimating(false), 300);
              }
            }}
          >
            <svg 
              className={`w-4 h-4 transition-all duration-300 ${isAnimating ? 'scale-125' : ''}`} 
              fill={isLiked ? "#00bb22" : "currentColor"} 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className={isLiked ? "text-green-400" : ""}>{likes}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
