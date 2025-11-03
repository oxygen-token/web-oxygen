import { NextResponse } from 'next/server';
import { SEObotService } from '../../../utils/seobot';

export async function GET() {
  try {
    const posts = await SEObotService.getPosts(1000, 0);
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts.map(post => `
  <url>
    <loc>https://yourdomain.com/blog/${post.slug}</loc>
    <lastmod>${new Date(post.publishedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
