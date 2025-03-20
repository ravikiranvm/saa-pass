export const prerender = true;

export async function GET({ url }) {
    const baseURL = 'https://thecloudsquad.com';

    const today = new Date().toISOString().split('T')[0];

    const pages = [
        { url: '/', lastMod: today, changeFreq: 'daily', priority: 1.0 },
        { url: '/test', lastMod: today, changeFreq: 'daily', priority: 0.8 },
        { url: '/result', lastMod: today, changeFreq: 'daily', priority: 0.7 },
        { url: '/review', lastMod: today, changeFreq: 'daily', priority: 0.6 }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages.map(page => `
            <url>
                <loc>${baseURL}${page.url}</loc>
                <lastmod>${page.lastMod}</lastmod>
                <changefreq>${page.changeFreq}</changefreq>
                <priority>${page.priority}</priority>
            </url>
        `).join('')}
    </urlset>`;

    return new Response(sitemap.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=3600',
        }
    });
}