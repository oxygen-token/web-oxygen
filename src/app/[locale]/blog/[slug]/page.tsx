import { getTranslations } from "next-intl/server";
import { BlogClient } from 'seobot';
import Rich_Content from "../../components/Blog/Rich_Content";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getPost(slug: string) {
  const key = process.env.SEOBOT_API_KEY;
  if (!key) {
    console.error('SEOBOT_API_KEY environment variable must be set');
    return null;
  }

  try {
    const client = new BlogClient(key);
    return await client.getArticle(slug);
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

function sanitizeArticleHtml(html: string, headline: string): string {
  if (!html) return html;
  const pattern = /<h[12][^>]*>\s*([^<]+?)\s*<\/h[12]>/i;
  const match = html.match(pattern);
  if (!match) return html;
  const text = match[1].trim();
  if (text === headline || match.index !== undefined && match.index < 300) {
    return html.replace(pattern, "");
  }
  return html;
}

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const t = await getTranslations("Blog");
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-dark to-teal-medium">
      <div className="relative">
        <div className="absolute top-6 right-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("backToBlog") || "Back to Blog"}
          </Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16">

        <article className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{post.headline}</h1>
            <div className="flex items-center gap-4 text-white/60 mb-6">
              <span>Oxygen Team</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <span>•</span>
              <span>{post.readingTime || 5} min read</span>
            </div>
            
            {post.image && (
              <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
                <img
                  src={post.image}
                  alt={post.headline}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag: any, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/80"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            )}
          </header>
          
          {(() => {
            const anyPost = post as any;
            const rawHtml = anyPost.content || anyPost.body || anyPost.html || anyPost.contentHtml || anyPost.article || anyPost.fullContent || '';
            const html = sanitizeArticleHtml(rawHtml, post.headline);
            return <Rich_Content html={html} />;
          })()}

          <footer className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center justify-between text-white/60">
              <div className="flex items-center gap-6">
                <span>0 {t("views") || "views"}</span>
                <span>0 {t("comments") || "comments"}</span>
                <span>0 {t("likes") || "likes"}</span>
              </div>
              <div className="text-sm">
                {t("publishedOn") || "Published on"} {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
