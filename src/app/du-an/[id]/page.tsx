import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/services/wpService';
import ProjectDetailClient from '@/components/projects/ProjectDetailClient';

// [SỬA 1] Interface khớp với tên thư mục [id]
interface Props {
  params: Promise<{ id: string }>; 
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; // [SỬA 2] Lấy id từ params
  const slug = id; // Coi id trên URL chính là slug

  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Không tìm thấy dự án' };
  
  return {
    title: `${project.title} | Đại Nam Wall`,
    description: project.desc,
    openGraph: {
        images: [project.image]
    }
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params; // [SỬA 3] Lấy id
  const slug = id; // Gán id vào biến slug để truyền xuống service

  if (!slug) {
      notFound();
  }

  // Gọi service lấy dữ liệu
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailClient project={project} />
  );
}