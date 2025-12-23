"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ReactFlow, Background, useNodesState, useEdgesState, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// --- Data ---

const SECTIONS = [
    {
        id: "intro",
        title: "Serverless at Scale",
        content: (
            <>
                <p>
                    This portfolio isn&apos;t just a static HTML file. It&apos;s a globally distributed,
                    event-driven application built on AWS.
                </p>
                <p className="mt-4">
                    By leveraging the <strong>AWS Cloud Development Kit (CDK)</strong>, the entire
                    infrastructure is defined as code (IaC), ensuring reproducibility, type safety,
                    and zero manual click-ops.
                </p>
            </>
        ),
    },
    {
        id: "edge",
        title: "1. The Global Edge",
        content: (
            <>
                <p>
                    To achieve sub-100ms latency globally, I architected a <strong>CloudFront</strong> distribution strategy
                    that caches static assets at the edge.
                </p>
                <p className="mt-4">
                    The <strong>S3 origin</strong> is strictly isolated using Origin Access Identity (OAI),
                    enforcing a zero-trust model where the bucket is completely invisible to the public internet
                    and only accessible via the signed edge delivery network.
                </p>
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-sm font-mono text-xs overflow-x-auto">
                    <p className="text-gray-500">{/* CDK: CloudFront Distribution */}</p>
                    <p className="text-purple-700">const</p> distribution = <p className="text-purple-700">new</p> cloudfront.Distribution(<p className="text-yellow-600">this</p>, <span className="text-green-600">&apos;SiteDistribution&apos;</span>, &#123;
                    <br />&nbsp;&nbsp;defaultBehavior: &#123;
                    <br />&nbsp;&nbsp;&nbsp;&nbsp;origin: <p className="text-purple-700">new</p> origins.S3Origin(siteBucket, &#123; originAccessIdentity &#125;),
                    <br />&nbsp;&nbsp;&nbsp;&nbsp;viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    <br />&nbsp;&nbsp;&#125;,
                    <br />&#125;);
                </div>
            </>
        ),
    },
    {
        id: "compute",
        title: "2. The Compute Layer",
        content: (
            <>
                <p>
                    Dynamic requests (like the contact form) bypass the cache and hit
                    <strong>API Gateway</strong>.
                </p>
                <p className="mt-4">
                    This triggers a <strong>Lambda</strong> function running Node.js. It&apos;s ephemeral compute:
                    it spins up, processes the request, and shuts down. No idle servers to pay for.
                </p>
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-sm font-mono text-xs overflow-x-auto">
                    <p className="text-gray-500">{/* Lambda Handler (TypeScript) */}</p>
                    <p className="text-purple-700">export const</p> handler = <p className="text-purple-700">async</p> (event: APIGatewayProxyEvent) ={">"} &#123;
                    <br />&nbsp;&nbsp;<p className="text-purple-700">const</p> body = JSON.parse(event.body || <span className="text-green-600">&apos;&#123;&#125;&apos;</span>);
                    <br />&nbsp;&nbsp;<p className="text-purple-700">await</p> validateInput(body);
                    <br />&nbsp;&nbsp;<p className="text-gray-500">{/* ... logic ... */}</p>
                    <br />&nbsp;&nbsp;<p className="text-purple-700">return</p> &#123; statusCode: 200, body: <span className="text-green-600">&apos;OK&apos;</span> &#125;;
                    <br />&#125;;
                </div>
            </>
        ),
    },
    {
        id: "data",
        title: "3. Data & Persistence",
        content: (
            <>
                <p>
                    State is stored in <strong>DynamoDB</strong>. It&apos;s a NoSQL key-value store designed
                    for single-digit millisecond latency at any scale.
                </p>
                <p className="mt-4">
                    We use a single-table design pattern where the Partition Key (PK) allows us to
                    efficiently query for specific entities (like form submissions or rate limits)
                    without complex joins.
                </p>
            </>
        ),
    },
    {
        id: "security",
        title: "4. Security & Cost Control",
        content: (
            <>
                <p>
                    Exposing a site to the public internet comes with risks. We mitigate them with
                    <strong>AWS WAF</strong> (Web Application Firewall) attached to CloudFront, providing
                    protection against common exploits and DDoS attacks.
                </p>
                <p className="mt-4">
                    To prevent unexpected bills, we use <strong>AWS Budgets</strong>.
                    If the forecasted monthly spend exceeds $1.00, an SNS alert is immediately sent to my phone.
                </p>
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-sm font-mono text-xs overflow-x-auto">
                    <p className="text-gray-500">{/* CDK: Budget Alarm */}</p>
                    <p className="text-purple-700">new</p> budgets.CfnBudget(<p className="text-yellow-600">this</p>, <span className="text-green-600">&apos;CostAlarm&apos;</span>, &#123;
                    <br />&nbsp;&nbsp;budget: &#123;
                    <br />&nbsp;&nbsp;&nbsp;&nbsp;budgetLimit: &#123; amount: <span className="text-blue-600">1</span>, unit: <span className="text-green-600">&apos;USD&apos;</span> &#125;,
                    <br />&nbsp;&nbsp;&nbsp;&nbsp;notificationsWithSubscribers: [
                    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123; notification: &#123; threshold: <span className="text-blue-600">80</span>, comparisonOperator: <span className="text-green-600">&apos;GREATER_THAN&apos;</span> &#125;, subscribers: [&#123; address: email, subscriptionType: <span className="text-green-600">&apos;EMAIL&apos;</span> &#125;] &#125;
                    <br />&nbsp;&nbsp;&nbsp;&nbsp;]
                    <br />&nbsp;&nbsp;&#125;
                    <br />&#125;);
                </div>
            </>
        ),
    },
];

// --- Nodes & Edges Setup ---

const initialNodes: Node[] = [
    { id: 'user', position: { x: 0, y: 0 }, data: { label: 'User' }, type: 'input', style: { background: '#fff', border: '1px solid #777', width: 80 } },
    { id: 'cloudfront', position: { x: 0, y: 150 }, data: { label: 'CloudFront' }, style: { background: '#f3f4f6', border: '1px solid #777' } },
    { id: 'waf', position: { x: -120, y: 150 }, data: { label: 'WAF' }, style: { background: '#fee2e2', border: '1px solid #ef4444' } },
    { id: 's3', position: { x: -150, y: 300 }, data: { label: 'S3 Bucket' }, style: { background: '#fff7ed', border: '1px solid #ea580c' } },
    { id: 'apigw', position: { x: 150, y: 300 }, data: { label: 'API Gateway' }, style: { background: '#eff6ff', border: '1px solid #2563eb' } },
    { id: 'lambda', position: { x: 150, y: 450 }, data: { label: 'Lambda' }, style: { background: '#fff7ed', border: '1px solid #ea580c' } },
    { id: 'dynamo', position: { x: 150, y: 600 }, data: { label: 'DynamoDB' }, style: { background: '#eff6ff', border: '1px solid #2563eb' } },
    { id: 'budgets', position: { x: 200, y: 0 }, data: { label: 'AWS Budgets' }, style: { background: '#ecfccb', border: '1px solid #65a30d' } },
];

const initialEdges: Edge[] = [
    { id: 'e1', source: 'user', target: 'cloudfront', animated: true },
    { id: 'e2', source: 'cloudfront', target: 's3', label: 'Static Content', animated: false },
    { id: 'e3', source: 'cloudfront', target: 'apigw', label: 'API /contact', animated: false },
    { id: 'e4', source: 'apigw', target: 'lambda', animated: false },
    { id: 'e5', source: 'lambda', target: 'dynamo', animated: false },
    { id: 'e6', source: 'waf', target: 'cloudfront', label: 'Protect', animated: false, style: { strokeDasharray: '5,5' } },
];

// --- Component ---

export default function WebsiteArchPage() {
    const [activeSection, setActiveSection] = useState("intro");
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

    // Update diagram based on active section
    useEffect(() => {
        const newEdges = initialEdges.map(edge => ({
            ...edge,
            animated: false,
            style: { ...edge.style, stroke: '#b1b1b7', strokeWidth: 1 },
        }));

        const newNodes = initialNodes.map(node => ({
            ...node,
            style: { ...node.style, opacity: 0.3 },
        }));

        // Helper to highlight
        const highlightNode = (id: string) => {
            const n = newNodes.find(n => n.id === id);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (n) n.style = { ...n.style, opacity: 1, boxShadow: '0 0 10px rgba(0,0,0,0.1)' } as any;
        };
        const highlightEdge = (id: string) => {
            const e = newEdges.find(e => e.id === id);
            if (e) {
                e.animated = true;
                e.style = { ...e.style, stroke: '#2563eb', strokeWidth: 2 };
            }
        };

        if (activeSection === "intro") {
            newNodes.forEach(n => n.style.opacity = 1);
        } else if (activeSection === "edge") {
            highlightNode('user');
            highlightNode('cloudfront');
            highlightNode('s3');
            highlightEdge('e1');
            highlightEdge('e2');
        } else if (activeSection === "compute") {
            highlightNode('user');
            highlightNode('cloudfront');
            highlightNode('apigw');
            highlightNode('lambda');
            highlightEdge('e1');
            highlightEdge('e3');
            highlightEdge('e4');
        } else if (activeSection === "data") {
            highlightNode('lambda');
            highlightNode('dynamo');
            highlightEdge('e5');
        } else if (activeSection === "security") {
            highlightNode('waf');
            highlightNode('cloudfront');
            highlightNode('budgets');
            highlightEdge('e6');
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setNodes(newNodes as any);
        setEdges(newEdges);
    }, [activeSection, setNodes, setEdges]);

    return (
        <div className="bg-[#fcfcfc] text-[#1a1a1a] min-h-screen font-sans">
            <div className="fixed top-0 left-0 w-1/2 h-screen hidden lg:block border-r border-gray-200 bg-gray-50/50">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    attributionPosition="bottom-left"
                >
                    <Background color="#e5e7eb" gap={20} />
                    {/* <Controls /> */}
                </ReactFlow>
            </div>

            <div className="lg:w-1/2 lg:ml-auto">
                <div className="max-w-xl mx-auto px-6 py-24">
                    <header className="mb-24">
                        <p className="font-mono text-xs text-gray-500 mb-4 tracking-widest uppercase">
                            Case Study 001
                        </p>
                        <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-6 text-gray-900">
                            Serverless at Scale
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed font-light">
                            A technical deep dive into the event-driven architecture, global caching strategy, and cost-optimization patterns that power this portfolio.
                        </p>
                    </header>

                    <div className="space-y-[50vh]">
                        {SECTIONS.map((section) => (
                            <Section
                                key={section.id}
                                title={section.title}
                                onInView={() => setActiveSection(section.id)}
                            >
                                {section.content}
                            </Section>
                        ))}
                    </div>

                    <div className="h-[20vh]" /> {/* Spacer at bottom */}
                </div>
            </div>
        </div>
    );
}

function Section({
    title,
    children,
    onInView,
}: {
    title: string;
    children: React.ReactNode;
    onInView: () => void;
}) {
    const ref = useRef(null);

    useEffect(() => {
        // Simple intersection observer or scroll check could work too, 
        // but we can use the scrollYProgress change to trigger.
        // Actually, let's use a simpler IntersectionObserver for robustness.
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onInView();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [onInView]);

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0.2 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-[50vh] flex flex-col justify-center"
        >
            <h2 className="font-serif text-2xl text-gray-900 mb-6">{title}</h2>
            <div className="text-gray-600 leading-relaxed text-lg">
                {children}
            </div>
        </motion.section>
    );
}
