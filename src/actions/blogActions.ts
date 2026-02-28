'use server'

import { getPaginatedPosts } from '@/services/wpService';

// Đánh dấu 'use server' để Next.js biết hàm này chỉ chạy trên môi trường Server bảo mật
export async function fetchMorePostsAction(
    first: number, 
    after: string, 
    category: string, 
    search: string, 
    tag: string
) {
    try {
        const data = await getPaginatedPosts(first, after, category, search, tag);
        return data;
    } catch (error) {
        console.error("Lỗi khi load more posts:", error);
        return { posts: [], pageInfo: { hasNextPage: false, endCursor: "" } };
    }
}