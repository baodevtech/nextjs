'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Target, Award, Users, Star, Quote, Clock, PenTool, Trophy, CheckCircle2, Medal } from 'lucide-react';
import { Button } from '@/components/common/UI';
import { AboutPageData, AboutCoreValue } from '@/types';

// Component render Icon động dựa trên string từ WP
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    const icons: Record<string, any> = {
        Target, Award, Users, Star, Quote, Clock, PenTool, Trophy, CheckCircle2, Medal
    };
    const IconComponent = icons[name] || CheckCircle2; // Fallback icon
    return <IconComponent className={className} size={28} />;
};

const TimelineItem: React.FC<{ year: string; title: string; desc: string }> = ({ year, title, desc }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
        );

        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, []);

    return (
        <div 
            ref={ref}
            className={`relative pl-8 md:pl-0 md:w-1/2 md:even:ml-auto md:odd:mr-auto md:even:pl-16 md:odd:pr-16 group transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
        >
            <div className="absolute left-0 md:left-auto md:right-0 md:even:left-0 md:even:right-auto top-0 w-px h-full bg-gray-200 md:group-odd:translate-x-[0.5px] md:group-even:-translate-x-[0.5px]">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-slate-900 rounded-full transition-transform duration-500 delay-300 ${isVisible ? 'scale-100' : 'scale-0'} group-hover:scale-125`}></div>
            </div>
            <div className="mb-2">
                <span className="text-5xl font-bold text-slate-200 group-hover:text-brand-600 transition-colors duration-300 tracking-tighter">{year}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-light text-justify">{desc}</p>
        </div>
    );
};

export default function AboutClient({ data }: { data: AboutPageData }) {
    return (
        <div className="bg-white animate-fade-in font-sans">
            {/* HERO SECTION */}
            <section className="relative h-[85vh] flex items-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 opacity-60">
                    <img src={data.heroBgImage} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6 animate-slide-up">
                            <div className="h-px w-12 bg-amber-400"></div>
                            <span className="text-amber-400 font-bold tracking-[0.2em] uppercase text-xs">{data.heroSince}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            {data.heroTitleNormal} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{data.heroTitleHighlight}</span>
                        </h1>
                        <p className="text-lg text-slate-300 font-light max-w-xl leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            {data.heroDesc}
                        </p>
                        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <Link href={data.heroBtnLink}>
                                <Button className="!bg-amber-400 !text-slate-900 hover:!bg-brand-600 hover:!text-white border-none px-8 py-4 text-sm font-bold tracking-wider uppercase transition-all duration-300">
                                    {data.heroBtnText}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* AWARD SECTION */}
            <section className="relative py-20 bg-slate-900 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Star size={14} className="fill-amber-400" /> {data.awardBadge}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            {data.awardTitleNormal} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300">{data.awardTitleHighlight}</span>
                        </h2>
                        <p className="text-slate-300 text-lg font-light leading-relaxed mb-8 text-justify">
                            {data.awardDesc}
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            {data.awardStats.map((stat, idx) => (
                                <div key={idx} className="border-l border-amber-500/30 pl-4">
                                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                    <p className="text-slate-400 text-xs uppercase">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:w-1/2 relative flex justify-center">
                        <div className="relative w-80 h-80 md:w-96 md:h-96">
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-full opacity-20 animate-pulse"></div>
                            <div className="absolute inset-4 border border-amber-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Trophy size={180} strokeWidth={1} className="text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]" />
                            </div>
                            <div className="absolute top-0 right-10 bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-xl animate-bounce delay-700">
                                <Medal className="text-amber-400 w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUALITY SECTION */}
            <section className="py-24 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-5 order-2 lg:order-1">
                            <h2 className="text-slate-900 font-bold text-3xl md:text-4xl mb-6 tracking-tight">
                                {data.qualityTitle}
                            </h2>
                            <div className="space-y-6 text-slate-600 font-light text-lg leading-relaxed text-justify">
                                <p>{data.qualityDesc1}</p>
                                <p>{data.qualityDesc2}</p>
                            </div>
                            
                            <div className="mt-8 flex items-center gap-4">
                                <img src={data.founderAvatar} className="w-12 h-12 rounded-full" alt={data.founderName} />
                                <div>
                                    <p className="text-slate-900 font-bold text-sm">{data.founderName}</p>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest">{data.founderRole}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 order-1 lg:order-2 grid grid-cols-2 gap-4">
                            <div className="space-y-4 mt-8">
                                <img src={data.qualityImg1} className="rounded-2xl w-full h-64 object-cover hover:grayscale transition-all duration-500" alt="Detail 1" />
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <p className="text-4xl font-bold text-brand-600 mb-2">{data.qualityStatValue}</p>
                                    <p className="text-slate-500 text-sm">{data.qualityStatLabel}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-900 p-6 rounded-2xl text-white">
                                    <Quote size={24} className="text-amber-400 mb-4" />
                                    <p className="text-sm font-light italic opacity-80">"{data.qualityQuote}"</p>
                                </div>
                                <img src={data.qualityImg2} className="rounded-2xl w-full h-80 object-cover hover:grayscale transition-all duration-500" alt="Detail 2" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CORE VALUES SECTION */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-xs block mb-3">{data.coreSub}</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{data.coreTitle}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.coreValues.map((val, idx) => (
                            <div key={idx} className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-brand-600 hover:shadow-2xl transition-all duration-300">
                                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-600 transition-colors">
                                    <DynamicIcon name={val.icon} className="text-slate-900 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">{val.title}</h3>
                                <p className="text-slate-500 font-light leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TIMELINE SECTION */}
            <section className="py-24 overflow-hidden bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Clock className="w-8 h-8 mx-auto text-slate-300 mb-4" />
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{data.timelineTitle}</h2>
                    </div>

                    <div className="relative space-y-12 md:space-y-0 md:flex md:flex-col">
                        <div className="absolute top-0 bottom-0 left-[15px] md:left-1/2 w-px bg-gray-100 -z-10"></div>
                        {data.timelines.map((item, idx) => (
                            <TimelineItem key={idx} year={item.year} title={item.title} desc={item.desc} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 bg-slate-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        {data.ctaTitle}
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 font-light max-w-2xl mx-auto">
                        {data.ctaDesc}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href={data.ctaBtn1Link}>
                             <Button className="h-14 px-12 text-sm font-bold uppercase tracking-widest bg-amber-400 text-slate-900 hover:bg-white border-none shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                                {data.ctaBtn1Text}
                             </Button>
                        </Link>
                        <Link href={data.ctaBtn2Link}>
                             <Button variant="outline" className="h-14 px-12 text-sm font-bold uppercase tracking-widest border-slate-700 text-white hover:bg-slate-800 hover:text-white hover:border-white">
                                {data.ctaBtn2Text}
                             </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}