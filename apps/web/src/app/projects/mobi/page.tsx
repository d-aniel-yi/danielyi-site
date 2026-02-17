"use client";

import { useState, useCallback } from "react";
import { ReactFlow, Background, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Play } from "lucide-react";

// --- Data ---

const STEPS = [
    {
        id: "overview",
        title: "Microservices Architecture",
        content: (
            <>
                <p>
                    Mobi is a complex image analysis platform. To handle heavy computational loads
                    (like SAM segmentation) without blocking the UI, we use an asynchronous
                    microservices architecture.
                </p>
                <p className="mt-4">
                    The system is containerized with <strong>Docker</strong>, orchestrated via
                    <strong> Docker Compose</strong>, and relies on a message broker pattern.
                </p>
            </>
        ),
    },
    {
        id: "docker",
        title: "Containerization Strategy",
        content: (
            <>
                <p>
                    Each service runs in its own isolated container. We use multi-stage builds
                    to keep image sizes small (e.g., stripping build tools from the final Python image).
                </p>
                <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
                    <p className="text-gray-500"># Dockerfile.backend</p>
                    <p><span className="text-purple-400">FROM</span> python:3.10-slim <span className="text-purple-400">as</span> builder</p>
                    <p><span className="text-purple-400">WORKDIR</span> /app</p>
                    <p><span className="text-purple-400">COPY</span> requirements.txt .</p>
                    <p><span className="text-purple-400">RUN</span> pip install --user -r requirements.txt</p>
                    <br />
                    <p className="text-gray-500"># Final Stage</p>
                    <p><span className="text-purple-400">FROM</span> python:3.10-slim</p>
                    <p><span className="text-purple-400">COPY</span> --from=builder /root/.local /root/.local</p>
                    <p><span className="text-purple-400">ENV</span> PATH=/root/.local/bin:$PATH</p>
                </div>
            </>
        ),
    },
    {
        id: "async",
        title: "Async Task Queue",
        content: (
            <>
                <p>
                    When a user requests a segmentation, the <strong>FastAPI</strong> backend doesn&apos;t
                    process it immediately. Instead, it pushes a job to <strong>Redis</strong>.
                </p>
                <p className="mt-4">
                    Specialized <strong>Celery Workers</strong> (CPU for logic, GPU for inference)
                    pick up these jobs. This decouples the HTTP request/response cycle from
                    heavy processing.
                </p>
                <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
                    <p className="text-gray-500"># task_queue/worker.py</p>
                    <p><span className="text-blue-400">@celery_app.task</span>(bind=True)</p>
                    <p><span className="text-purple-400">def</span> <span className="text-yellow-300">process_image</span>(self, image_id):</p>
                    <p>&nbsp;&nbsp;logger.info(f<span className="text-green-400">&quot;Processing &#123;image_id&#125;...&quot;</span>)</p>
                    <p>&nbsp;&nbsp;<span className="text-gray-500"># Heavy lifting here</span></p>
                    <p>&nbsp;&nbsp;result = model.predict(image_id)</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">return</span> result</p>
                </div>
            </>
        ),
    },
    {
        id: "sql",
        title: "SQL Proficiency",
        content: (
            <>
                <p>
                    We use <strong>PostgreSQL</strong> for structured data. Complex spatial queries
                    are optimized using indices.
                </p>
                <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
                    <p className="text-gray-500">-- Analyze user activity</p>
                    <p><span className="text-purple-400">SELECT</span> u.email, <span className="text-purple-400">COUNT</span>(m.id) <span className="text-purple-400">as</span> measurement_count</p>
                    <p><span className="text-purple-400">FROM</span> users u</p>
                    <p><span className="text-purple-400">JOIN</span> images i <span className="text-purple-400">ON</span> u.id = i.user_id</p>
                    <p><span className="text-purple-400">JOIN</span> measurements m <span className="text-purple-400">ON</span> i.id = m.image_id</p>
                    <p><span className="text-purple-400">WHERE</span> m.created_at {">"} <span className="text-green-400">NOW()</span> - <span className="text-purple-400">INTERVAL</span> <span className="text-green-400">&apos;7 days&apos;</span></p>
                    <p><span className="text-purple-400">GROUP BY</span> u.id</p>
                    <p><span className="text-purple-400">ORDER BY</span> measurement_count <span className="text-purple-400">DESC</span>;</p>
                </div>
            </>
        ),
    },
];

// --- Nodes & Edges ---

const initialNodes = [
    { id: 'frontend', position: { x: 0, y: 0 }, data: { label: 'Frontend (Next.js)' }, style: { background: '#fff', border: '1px solid #777', width: 150 } },
    { id: 'backend', position: { x: 0, y: 150 }, data: { label: 'Backend (FastAPI)' }, style: { background: '#f0fdf4', border: '1px solid #16a34a', width: 150 } },
    { id: 'redis', position: { x: 250, y: 150 }, data: { label: 'Redis Broker' }, style: { background: '#fef2f2', border: '1px solid #dc2626' } },
    { id: 'worker', position: { x: 250, y: 300 }, data: { label: 'Celery Worker' }, style: { background: '#fffbeb', border: '1px solid #d97706' } },
    { id: 'db', position: { x: 0, y: 300 }, data: { label: 'PostgreSQL' }, style: { background: '#eff6ff', border: '1px solid #2563eb' } },
];

const initialEdges = [
    { id: 'e1', source: 'frontend', target: 'backend', label: 'HTTP', animated: false },
    { id: 'e2', source: 'backend', target: 'redis', label: 'Push Job', animated: false },
    { id: 'e3', source: 'redis', target: 'worker', label: 'Pop Job', animated: false },
    { id: 'e4', source: 'backend', target: 'db', label: 'Read/Write', animated: false },
    { id: 'e5', source: 'worker', target: 'db', label: 'Save Result', animated: false },
];

export default function MobiArchPage() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Simulation state
    const [isSimulating, setIsSimulating] = useState(false);

    const runSimulation = useCallback(() => {
        setIsSimulating(true);
        // Reset edges
        const resetEdges = initialEdges.map(e => ({ ...e, animated: false, style: { stroke: '#b1b1b7' } }));
        setEdges(resetEdges);

        // Sequence
        setTimeout(() => {
            setEdges(eds => eds.map(e => e.id === 'e1' ? { ...e, animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } } : e));
        }, 500);
        setTimeout(() => {
            setEdges(eds => eds.map(e => e.id === 'e2' ? { ...e, animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } } : e));
        }, 1500);
        setTimeout(() => {
            setEdges(eds => eds.map(e => e.id === 'e3' ? { ...e, animated: true, style: { stroke: '#d97706', strokeWidth: 2 } } : e));
        }, 2500);
        setTimeout(() => {
            setEdges(eds => eds.map(e => e.id === 'e5' ? { ...e, animated: true, style: { stroke: '#2563eb', strokeWidth: 2 } } : e));
            setIsSimulating(false);
        }, 4000);
    }, [setEdges]);

    return (
        <div className="bg-[#fcfcfc] text-[#1a1a1a] min-h-screen font-sans flex flex-col lg:flex-row">
            {/* Left Panel: Diagram */}
            <div className="lg:w-1/2 h-[50vh] lg:h-screen border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50/50 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    attributionPosition="bottom-left"
                >
                    <Background color="#e5e7eb" gap={20} />
                </ReactFlow>

                <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-sm border border-gray-200">
                    <h3 className="font-serif text-sm font-medium mb-2">Live Simulation</h3>
                    <button
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-mono rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                        <Play className="w-3 h-3" />
                        {isSimulating ? "Processing..." : "Submit Job"}
                    </button>
                </div>
            </div>

            {/* Right Panel: Content */}
            <div className="lg:w-1/2 h-auto lg:h-screen overflow-y-auto">
                <div className="max-w-xl mx-auto px-8 py-24">
                    <header className="mb-16">
                        <p className="font-mono text-xs text-gray-500 mb-4 tracking-widest uppercase">
                            Case Study 002
                        </p>
                        <h1 className="font-serif text-4xl font-medium tracking-tight mb-6 text-gray-900">
                            Mobi: Microservices
                        </h1>
                    </header>

                    <div className="space-y-24">
                        {STEPS.map((step) => (
                            <section key={step.id} className="scroll-mt-24">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-[1px] bg-gray-300"></div>
                                    <h2 className="font-serif text-xl text-gray-900">{step.title}</h2>
                                </div>
                                <div className="text-gray-600 leading-relaxed text-sm pl-11">
                                    {step.content}
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="h-24" />
                </div>
            </div>
        </div>
    );
}
