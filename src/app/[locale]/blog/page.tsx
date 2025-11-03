"use client";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import Blog_Header from "../components/Blog/Blog_Header";
import Blog_Post from "../components/Blog/Blog_Post";
import { blog_Posts } from "../components/Blog/Blog_Data";

export default function Blog_Page() {
  const t = useTranslations("Blog");
  const postsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const postsContainer = postsContainerRef.current;
    const mainContainer = document.querySelector('.blog-main-container') as HTMLElement;
    if (!postsContainer || !mainContainer) return;

    const isMobile = window.innerWidth < 1024;

    const handleScroll = () => {
      if (!isMobile) {
        // En desktop: scroll directo siempre habilitado
        postsContainer.style.overflowY = 'auto';
        postsContainer.style.pointerEvents = 'auto';
        return;
      }

      // Solo en móvil: lógica del tope
      const mainScrollTop = mainContainer.scrollTop;
      const mainScrollHeight = mainContainer.scrollHeight;
      const mainClientHeight = mainContainer.clientHeight;
      
      // Si el scroll principal llegó al final (tope)
      if (mainScrollTop + mainClientHeight >= mainScrollHeight - 10) {
        postsContainer.style.overflowY = 'auto';
        postsContainer.style.pointerEvents = 'auto';
      } else {
        postsContainer.style.overflowY = 'hidden';
        postsContainer.style.pointerEvents = 'none';
      }
    };

    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      if (newIsMobile !== isMobile) {
        // Resetear cuando cambia de móvil a desktop o viceversa
        postsContainer.style.overflowY = newIsMobile ? 'hidden' : 'auto';
        postsContainer.style.pointerEvents = newIsMobile ? 'none' : 'auto';
      }
    };

    handleScroll();
    mainContainer.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      mainContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/images/blogBg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-dark/70 via-teal-dark/60 to-teal-medium/70"></div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      
      <div className="relative z-10 h-full overflow-y-auto blog-main-container">
        <div className="pt-16 lg:pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <div className="sticky top-32">
                  <p className="text-lg text-white/80 mb-4 lg:mb-8 leading-relaxed">
                    {t("subtitle") || "Discover the latest news, insights, and stories about environmental conservation and our mission to protect native forests."}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="mb-4 lg:mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2 lg:mb-3">
                    {t("allPosts") || "All Posts"}
                  </h2>
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder") || "Search posts..."}
                      className="w-full pl-8 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent text-sm"
                    />
                    <svg
                      className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div 
                  ref={postsContainerRef}
                  className="h-[calc(100vh-240px)] lg:h-[calc(100vh-320px)] overflow-hidden lg:overflow-auto pr-4 space-y-8 scrollbar-hide"
                  style={{ 
                    pointerEvents: 'none'
                  }}
                >
                  {blog_Posts.map((post) => (
                    <Blog_Post
                      key={post.id}
                      id={post.id}
                      image={post.image}
                      title={post.title}
                      excerpt={post.excerpt}
                      author={post.author}
                      date={post.date}
                      readTime={post.readTime}
                      views={post.views}
                      comments={post.comments}
                      likes={post.likes}
                      slug={post.slug}
                    />
                  ))}

                  <div className="text-center mt-16">
                    <div className="inline-flex items-center gap-2 text-white/60">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      <span className="text-sm">
                        {t("moreComing") || "More articles coming soon..."}
                      </span>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
