// src/app/projects/page.tsx
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllProjects, getUniversalSEO } from '@/services/wpService';
import ProjectListClient from '@/components/projects/ProjectListClient';

// 1. Sinh Metadata ĐỘNG từ RankMath SEO cho trang Dự Án
export async function generateMetadata(): Promise<Metadata> {
  // Thay '/projects/' bằng URI thực tế của trang dự án trên WP của bạn
  const seoData = await getUniversalSEO('/projects/'); 
  const seo = seoData?.seo;

  if (!seo) {
    return {
      title: 'Dự Án Thực Tế | Kho Panel',
      description: 'Khám phá các dự án thi công nội thất, ốp tường, lam sóng tiêu biểu được thực hiện bởi đội ngũ Kho Panel.',
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
      type: 'website',
      locale: seo.openGraph?.locale || 'vi_VN',
      images: seo.openGraph?.image?.secureUrl ? [{ url: seo.openGraph.image.secureUrl }] : [],
    },
    robots: { index: seo.robots?.includes('index'), follow: seo.robots?.includes('follow') }
  };
}

export default async function ProjectsPage() {
  const [projects, seoNode] = await Promise.all([
    getAllProjects(),
    getUniversalSEO('/projects/') // Lấy Schema
  ]);

  const schemaRaw = seoNode?.seo?.jsonLd?.raw || null;

  return (
    <>
      {schemaRaw && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaRaw }} />
      )}
      
      <h1 className="sr-only">
        {seoNode?.title || 'Các dự án thi công thực tế của Kho Panel'}
      </h1>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Đang tải danh sách dự án...</div>}>
        <ProjectListClient initialProjects={projects} />
      </Suspense>
    </>
  );
}