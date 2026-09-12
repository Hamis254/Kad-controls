import type { MetadataRoute } from 'next';
import { asc, eq } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { products } from '@/backend/db/schema';

const SITE_URL = 'https://www.kadcontrols.co.ke';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activeProducts = await db.query.products.findMany({
    columns: { id: true, updatedAt: true },
    where: eq(products.isActive, true),
    orderBy: [asc(products.updatedAt)],
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/catalogue`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/what-we-do`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/partners`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/careers`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.6 },
  ];

  return [
    ...staticRoutes,
    ...activeProducts.map((product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}