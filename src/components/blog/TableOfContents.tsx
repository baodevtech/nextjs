'use client';

import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: string;
}

export const TableOfContents = ({ toc }: { toc: TocItem[] }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Logic: Theo dõi cuộn trang để highlight mục lục
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -40% 0px' }
    );

    // Gắn observer vào các thẻ Heading trong bài viết
    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200">
      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        Mục lục
      </h4>
      <nav className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              setActiveId(item.id);
            }}
            className={`
              block py-2 text-sm transition-all border-l-2 pl-3
              ${item.level === 'h3' ? 'ml-3' : ''}
              ${activeId === item.id 
                ? 'border-amber-500 text-amber-700 font-bold bg-amber-50 rounded-r-lg' // Style Active
                : 'border-transparent text-slate-600 hover:text-amber-600 hover:border-amber-200' // Style thường
              }
            `}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
};