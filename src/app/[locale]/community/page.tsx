import { getTranslations } from "next-intl/server";
import { BlogClient } from 'seobot';
import Blog_Post from "../components/Blog/Blog_Post";

async function getPosts(page: number = 0) {
  const key = process.env.SEOBOT_API_KEY;
  console.log('🔑 SEOBOT_API_KEY:', key ? 'SET' : 'NOT SET');
  
  if (!key) {
    console.error('SEOBOT_API_KEY environment variable must be set');
    return { articles: [], total: 0 };
  }

  try {
    const client = new BlogClient(key);
    const result = await client.getArticles(page, 10);
    console.log('📊 API Result:', { articlesCount: result.articles?.length || 0, total: result.total });
    return result;
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    return { articles: [], total: 0 };
  }
}

export default async function SEObot_Blog_Page() {
  const t = await getTranslations("Blog");
  const { articles, total } = await getPosts(0);
  const posts = articles || [];

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
                    {t("seobotBlogSubtitle") || "Discover the latest AI-generated content about environmental conservation, sustainability, and our mission to protect native forests."}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="mb-4 lg:mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2 lg:mb-3">
                    {t("allPosts") || "All Posts"}
                  </h2>
                </div>

                <div className="space-y-8">
                  {posts.length === 0 ? (
                    <div className="text-center text-white/60">
                      <p>{t("noPosts") || "No posts available."}</p>
                    </div>
                  ) : (
                    posts.map((article: any) => (
                      <Blog_Post
                        key={article.id}
                        id={article.id}
                        image={article.image || '/assets/images/forest.jpg'}
                        title={article.headline}
                        excerpt={article.metaDescription || ''}
                        author="Oxygen Team"
                        date={new Date(article.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        readTime={`${article.readingTime || 5} min read`}
                        views={0}
                        comments={0}
                        likes={0}
                        slug={article.slug}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
