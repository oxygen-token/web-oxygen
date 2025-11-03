import { BlogClient } from 'seobot';

const SEOBOT_API_KEY = process.env.SEOBOT_API_KEY || '';

class SEObotServiceClass {
  private client: BlogClient | null = null;

  private getClient(): BlogClient {
    if (!this.client) {
      if (!SEOBOT_API_KEY) {
        throw new Error('SEOBOT_API_KEY environment variable is not set');
      }
      this.client = new BlogClient(SEOBOT_API_KEY);
    }
    return this.client;
  }

  async getPosts(limit: number = 1000, offset: number = 0) {
    try {
      if (!SEOBOT_API_KEY) {
        return [];
      }

      const client = this.getClient();
      const page = Math.floor(offset / 10);
      const result = await client.getArticles(page, limit);
      
      return (result.articles || []).map((article: any) => ({
        slug: article.slug,
        publishedAt: article.publishedAt || article.createdAt || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching posts from SEObot:', error);
      return [];
    }
  }
}

export const SEObotService = new SEObotServiceClass();

