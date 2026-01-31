// src/app/projects/page.tsx
import { getAllProjects } from '@/services/wpService';
import ProjectListClient from '@/components/projects/ProjectListClient'; // Chúng ta sẽ tách Client Component ra

export const metadata = {
  title: 'Dự Án Tiêu Biểu | Đại Nam Wall',
  description: 'Tuyển tập những công trình kiến trúc nội thất đẳng cấp.',
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  
  // Lấy danh sách Categories duy nhất từ projects
  const categories = Array.from(new Set(projects.map(p => p.category)));

  return (
    <ProjectListClient initialProjects={projects} categories={categories} />
  );
}