import React from 'react';
import { Phone } from 'lucide-react';

export const FloatingContact = () => (
  <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
    <a href="tel:0912345678" className="w-12 h-12 bg-red-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform animate-bounce">
      <Phone size={20} />
    </a>
    <a 
      href="https://zalo.me/0912345678" 
      target="_blank" 
      rel="noreferrer"
      className="w-12 h-12 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
      title="Chat Zalo"
    >
      <span className="font-bold text-[10px] uppercase">Zalo</span>
    </a>
  </div>
);