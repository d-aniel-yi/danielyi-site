"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Server, Box, FileText } from "lucide-react";
import React, { useRef } from "react";

export default function TechDemosPage() {
    return (
        <div className="min-h-screen bg-[#fdfbf7] text-[#1a1a1a] selection:bg-[#e0e0e0] relative overflow-hidden">
            {/* Grain Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="max-w-6xl mx-auto px-6 py-32 relative z-10">
                <motion.header
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-32 text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/5 border border-gray-900/10 mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600 font-medium">
                            Engineering Lab
                        </span>
                    </div>

                    <h1 className="font-serif text-6xl md:text-7xl font-medium tracking-tight mb-8 text-gray-900 leading-[1.1]">
                        The Architecture <br /> <span className="italic text-gray-500">Behind the Code</span>
                    </h1>

                    <p className="text-xl text-gray-600 leading-relaxed font-light max-w-2xl mx-auto">
                        Interactive case studies exploring the infrastructure, microservices,
                        and design patterns that power my work.
                    </p>
                </motion.header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TiltCard
                        href="/tech-demos/website"
                        category="Infrastructure"
                        title="Serverless at Scale"
                        description="A deep dive into the event-driven AWS architecture. Exploring CloudFront edge caching, Lambda cold starts, and DynamoDB access patterns."
                        icon={<Server className="w-8 h-8" />}
                        color="from-blue-500/10 to-purple-500/10"
                        delay={0.2}
                    />
                    <TiltCard
                        href="/tech-demos/mobi"
                        category="Microservices"
                        title="Mobi Platform"
                        description="Analyzing the containerized architecture of Mobi. A walkthrough of Docker optimization, Celery async task queues, and high-performance SQL."
                        icon={<Box className="w-8 h-8" />}
                        color="from-emerald-500/10 to-teal-500/10"
                        delay={0.3}
                    />
                    <TiltCard
                        href="/tech-demos/fsbo"
                        category="System Anatomy"
                        title="Compliance Engine"
                        description="A 5-layer deep dive into an automated legal document generator. Exploring complex UX logic, address normalization, and PDF assembly."
                        icon={<FileText className="w-8 h-8" />}
                        color="from-blue-500/10 to-indigo-500/10"
                        delay={0.4}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="mt-32 text-center"
                >
                    <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                        More case studies coming soon
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

function TiltCard({
    href,
    category,
    title,
    description,
    icon,
    color,
    delay,
}: {
    href: string;
    category: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    delay: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <Link href={href} className="block group perspective-1000">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative h-full bg-white rounded-xl border border-gray-200/60 shadow-xl shadow-gray-200/40 p-10 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-gray-200/60 transition-shadow duration-500"
            >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full transform transition-transform duration-500 group-hover:translate-z-10">
                    <div className="mb-8 p-4 bg-gray-50 rounded-2xl w-fit text-gray-900 group-hover:scale-110 transition-transform duration-500 border border-gray-100">
                        {icon}
                    </div>

                    <div className="mb-auto">
                        <p className="font-mono text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                            {category}
                        </p>
                        <h2 className="font-serif text-3xl text-gray-900 mb-4 group-hover:text-black transition-colors">
                            {title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed font-light">
                            {description}
                        </p>
                    </div>

                    <div className="mt-10 flex items-center text-sm font-medium text-gray-900 group-hover:translate-x-2 transition-transform duration-300">
                        Explore Case Study <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
