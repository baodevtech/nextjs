import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200', // Default fallback image
  url = window.location.href, 
  type = 'website',
  schema 
}) => {
  const siteTitle = 'Đại Nam Wall | Kiến Tạo Không Gian Đẳng Cấp';
  const fullTitle = `${title} | Đại Nam Wall`;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // 2. Helper to update/create meta tags
    const updateMeta = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Update Standard Meta
    updateMeta('description', description);

    // 4. Update Open Graph (Facebook/LinkedIn)
    updateMeta('og:title', fullTitle, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:url', url, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:site_name', 'Đại Nam Wall', 'property');

    // 5. Update Twitter Card
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', fullTitle, 'name');
    updateMeta('twitter:description', description, 'name');
    updateMeta('twitter:image', image, 'name');

    // 6. Inject JSON-LD Schema
    if (schema) {
      let script = document.querySelector('#seo-schema');
      if (!script) {
        script = document.createElement('script');
        script.id = 'seo-schema';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }

    // Cleanup logic (optional: reset title on unmount)
    return () => {
      // document.title = siteTitle; 
      // We keep the title to avoid flickering, but you could reset here if desired.
    };
  }, [title, description, image, url, type, schema, fullTitle]);

  return null;
};
