// src/app/projects/[id]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getUniversalSEO } from '@/services/wpService';
import ProjectDetailClient from '@/components/projects/ProjectDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // Tùy cấu hình WP, URI có thể là /projects/slug/ hoặc /project/slug/
  const seoData = await getUniversalSEO(`/projects/${id}/`); 
  const seo = seoData?.seo;

  if (!seo) {
    const project = await getProjectBySlug(id);
    if (!project) return { title: 'Dự án không tồn tại | Kho Panel' };
    
    return {
      title: `${project.title} | Kho Panel`,
      description: project.desc || `Chi tiết dự án ${project.title} thực hiện bởi Kho Panel.`,
      openGraph: {
        title: project.title,
        description: project.desc || `Chi tiết dự án ${project.title} thực hiện bởi Kho Panel.`,
        images: [{ url: project.image }],
        type: 'article', 
      },
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonicalUrl },
    openGraph: {
      title: seo.openGraph?.title || seo.title,
      description: seo.openGraph?.description || seo.description,
      url: seo.openGraph?.url,
      siteName: seo.openGraph?.siteName,
      type: 'article', // Ép về article cho an toàn
      locale: seo.openGraph?.locale || 'vi_VN',
      images: seo.openGraph?.image?.secureUrl ? [{ url: seo.openGraph.image.secureUrl }] : [],
    },
    robots: { index: seo.robots?.includes('index'), follow: seo.robots?.includes('follow') }
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [project, seoNode] = await Promise.all([
    getProjectBySlug(id),
    getUniversalSEO(`/projects/${id}/`)
  ]);

  if (!project) {
    notFound();
  }

  const schemaRaw = seoNode?.seo?.jsonLd?.raw || null;

 return (
    <>
      {schemaRaw && (
        <script 
          id="rankmath-schema" // 👇 THÊM DÒNG NÀY ĐỂ CHỐNG NHÂN ĐÔI
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: schemaRaw }} 
        />
      )}
      
      <ProjectDetailClient project={project} />
    </>
  );
}