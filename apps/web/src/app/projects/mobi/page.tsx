"use client";

import { useCallback, useEffect } from "react";
import { ReactFlow, Background, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Github } from "lucide-react";

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
    {
        id: "sam-ml-pipeline",
        title: "SAM/ML Pipeline",
        content: (
            <>
                <p>
                    Mobi uses Meta&apos;s Segment Anything Model (SAM) for AI-powered image segmentation.
                    Running inference on a GPU is expensive — the architecture separates embedding generation
                    from prediction and caches embeddings in Redis so repeated interactions on the same image
                    do not recompute from scratch.
                </p>
                <p className="mt-4">
                    When a user uploads an image, a Celery GPU worker loads SAM using <strong>sam_model_registry</strong>,
                    a registry pattern that maps model variant names (e.g., <code>&quot;vit_h&quot;</code>) to constructor
                    functions. The model loads once per worker and is cached globally — subsequent calls return the
                    cached predictor immediately.
                </p>
                <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
                    <p className="text-gray-500"># gpu_sam_tasks.py — model loading (lines 43–74)</p>
                    <p><span className="text-purple-400">def</span> <span className="text-yellow-300">get_sam_predictor_on_gpu</span>() -&gt; SamPredictor:</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">global</span> _gpu_sam_model, _gpu_sam_predictor, _gpu_is_model_loaded</p>
                    <br />
                    <p>&nbsp;&nbsp;<span className="text-purple-400">if</span> _gpu_is_model_loaded <span className="text-purple-400">and</span> _gpu_sam_predictor:</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> _gpu_sam_predictor</p>
                    <br />
                    <p>&nbsp;&nbsp;sam_model_type = settings.SAM_MODEL_TYPE&nbsp;&nbsp;<span className="text-gray-500"># e.g., &quot;vit_h&quot;</span></p>
                    <p>&nbsp;&nbsp;_gpu_sam_model = sam_model_registry[sam_model_type](checkpoint=sam_checkpoint_abs)</p>
                    <p>&nbsp;&nbsp;_gpu_sam_model.to(device=<span className="text-green-400">&quot;cuda&quot;</span>)</p>
                    <p>&nbsp;&nbsp;_gpu_sam_predictor = SamPredictor(_gpu_sam_model)</p>
                    <p>&nbsp;&nbsp;_gpu_is_model_loaded = <span className="text-purple-400">True</span></p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">return</span> _gpu_sam_predictor</p>
                </div>
                <p className="mt-4">
                    After the model is ready, a second Celery task generates image embeddings.
                    <strong> predictor.set_image()</strong> converts the image into a high-dimensional feature
                    representation. These features (<code>predictor.features</code>) are serialized and written
                    to Redis with a 1-hour TTL. The main service polls Redis until embeddings appear before
                    dispatching the prediction task.
                </p>
                <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
                    <p className="text-gray-500"># gpu_sam_tasks.py — embedding generation (lines 81–144)</p>
                    <p><span className="text-blue-400">@celery_app.task</span>(name=<span className="text-green-400">&quot;gpu_sam_tasks.generate_embedding_gpu_task&quot;</span>, ignore_result=<span className="text-purple-400">True</span>)</p>
                    <p><span className="text-purple-400">def</span> <span className="text-yellow-300">generate_embedding_gpu_task</span>(image_id: str, image_path: str):</p>
                    <p>&nbsp;&nbsp;predictor = get_sam_predictor_on_gpu()</p>
                    <p>&nbsp;&nbsp;image_rgb = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)</p>
                    <p>&nbsp;&nbsp;predictor.set_image(image_rgb)</p>
                    <br />
                    <p>&nbsp;&nbsp;embedding_data = &#123;</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">&quot;features_serialized&quot;</span>: _serialize_tensor(predictor.features),</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">&quot;original_size_hw&quot;</span>: predictor.original_size,</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">&quot;input_size_hw&quot;</span>: predictor.input_size,</p>
                    <p>&nbsp;&nbsp;&#125;</p>
                    <p>&nbsp;&nbsp;sam_service.cache_image_embedding(</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;image_id=image_id, embedding_data=embedding_data, expiration_seconds=<span className="text-orange-400">3600</span></p>
                    <p>&nbsp;&nbsp;)</p>
                </div>
            </>
        ),
    },
    {
        id: "websocket-notifications",
        title: "Real-time Notifications",
        content: (
            <>
                <p>
                    Rather than polling the server for task completion, Mobi uses WebSocket connections
                    to push notifications to the browser the moment a background job finishes. The scope
                    is intentionally narrow: the WebSocket channel carries notification events only,
                    not live data streams.
                </p>
                <p className="mt-4">
                    <strong>ConnectionManager</strong> maintains a registry of active WebSocket connections
                    keyed by user ID. A <code>Dict[str, List[WebSocket]]</code> structure allows a single
                    user to have multiple simultaneous connections (e.g., multiple browser tabs) — each tab
                    receives the notification. An <code>asyncio.Lock()</code> prevents concurrent modification
                    of the registry.
                </p>
                <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
                    <p className="text-gray-500"># connection_manager.py (lines 5–34)</p>
                    <p><span className="text-purple-400">class</span> <span className="text-yellow-300">ConnectionManager</span>:</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">def</span> <span className="text-yellow-300">__init__</span>(self):</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;self._connections: <span className="text-blue-400">Dict[str, List[WebSocket]]</span> = &#123;&#125;</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;self._lock = asyncio.Lock()</p>
                    <br />
                    <p>&nbsp;&nbsp;<span className="text-purple-400">async def</span> <span className="text-yellow-300">connect</span>(self, user_id: str, websocket: WebSocket):</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">await</span> websocket.accept()</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">async with</span> self._lock:</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self._connections.setdefault(user_id, []).append(websocket)</p>
                    <br />
                    <p>&nbsp;&nbsp;<span className="text-purple-400">async def</span> <span className="text-yellow-300">send_personal</span>(self, user_id: str, data):</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">async with</span> self._lock:</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;conns = self._connections.get(user_id, [])</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">for</span> ws <span className="text-purple-400">in</span> conns:</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">await</span> ws.send_json(data)</p>
                </div>
                <p className="mt-4">
                    When a Celery task completes, <strong>NotificationService.create_and_dispatch()</strong> persists
                    a <code>Notification</code> row to PostgreSQL first, then calls <code>manager.send_personal()</code>
                    to fan out to all of the user&apos;s connected clients. The persistence-first pattern ensures
                    notifications survive page refreshes — the frontend can re-fetch missed notifications on reconnect.
                </p>
                <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
                    <p className="text-gray-500"># notification_service.py (lines 12–20)</p>
                    <p><span className="text-purple-400">async def</span> <span className="text-yellow-300">create_and_dispatch</span>(self, notif: NotificationCreate) -&gt; Notification:</p>
                    <p>&nbsp;&nbsp;db_obj = crud_notification.create_notification(self.db, notif)</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">await</span> manager.send_personal(notif.user_id, &#123;</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">&quot;id&quot;</span>: db_obj.id,</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">&quot;message&quot;</span>: db_obj.message,</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">&quot;severity&quot;</span>: db_obj.severity,</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">&quot;type&quot;</span>: db_obj.type,</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">&quot;created_at&quot;</span>: db_obj.created_at.isoformat(),</p>
                    <p>&nbsp;&nbsp;&#125;)</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">return</span> db_obj</p>
                </div>
            </>
        ),
    },
    {
        id: "ui-design",
        title: "Workspace UI",
        content: (
            <>
                <p>
                    The Mobi frontend is a multi-panel workspace where every pane can be dragged, resized,
                    and rearranged. Rather than building custom drag handlers, the app delegates this entirely
                    to <strong>react-mosaic-component</strong> — a tiling window manager for React.
                </p>
                <p className="mt-4">
                    <strong>LayoutManager</strong> is a thin controlled wrapper. It receives <code>layout</code> (the
                    current tile tree), <code>renderTile</code> (how to render each view), and <code>onChange</code> (a
                    callback when the user repositions a panel). The underlying <code>Mosaic</code> component handles
                    all hit-testing, pointer events, and animation. Panels can be resized down to 1% of available
                    space via <code>minimumPaneSizePercentage</code>.
                </p>
                <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
                    <p className="text-gray-500"># LayoutManager.tsx (lines 13–72)</p>
                    <p><span className="text-purple-400">import</span> &#123; Mosaic &#125; <span className="text-purple-400">from</span> <span className="text-green-400">&apos;react-mosaic-component&apos;</span></p>
                    <br />
                    <p><span className="text-purple-400">const</span> <span className="text-yellow-300">LayoutManager</span> = &lt;T <span className="text-purple-400">extends</span> string = ViewId&gt;(props: <span className="text-blue-400">LayoutManagerProps&lt;T&gt;</span>) =&gt; &#123;</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">const</span> &#123; renderTile, layout, onChange &#125; = props</p>
                    <br />
                    <p>&nbsp;&nbsp;<span className="text-purple-400">return</span> (</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&lt;Mosaic&lt;T&gt;</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;renderTile=&#123;renderTile&#125;</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value=&#123;layout&#125;</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onChange=&#123;onChange&#125;</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;className=<span className="text-green-400">&quot;mosaic-custom-theme&quot;</span></p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resize=&#123;&#123; minimumPaneSizePercentage: <span className="text-orange-400">1</span> &#125;&#125;</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;/&gt;</p>
                    <p>&nbsp;&nbsp;)</p>
                    <p>&#125;</p>
                </div>
                <p className="mt-4">
                    The bottom toolbar uses Material-UI icons — pre-built accessible SVG components imported by
                    name. Each panel type maps to a semantic icon: a ruler for the measurement tool, a clipboard
                    for tasks, a chart for results. No hand-drawn SVGs or custom paths are needed.
                </p>
                <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
                    <p className="text-gray-500"># BottomBar.tsx (lines 3–5)</p>
                    <p><span className="text-purple-400">import</span> <span className="text-yellow-300">RulerIcon</span> <span className="text-purple-400">from</span> <span className="text-green-400">&apos;@mui/icons-material/Straighten&apos;</span></p>
                    <p><span className="text-purple-400">import</span> <span className="text-yellow-300">TaskIcon</span> <span className="text-purple-400">from</span> <span className="text-green-400">&apos;@mui/icons-material/Assignment&apos;</span></p>
                    <p><span className="text-purple-400">import</span> <span className="text-yellow-300">ResultsIcon</span> <span className="text-purple-400">from</span> <span className="text-green-400">&apos;@mui/icons-material/InsertChart&apos;</span></p>
                    <br />
                    <p className="text-gray-500"># Used in JSX as:</p>
                    <p>&lt;<span className="text-yellow-300">RulerIcon</span> /&gt;&nbsp;&nbsp;&lt;<span className="text-yellow-300">TaskIcon</span> fontSize=<span className="text-green-400">&quot;small&quot;</span> /&gt;&nbsp;&nbsp;&lt;<span className="text-yellow-300">ResultsIcon</span> /&gt;</p>
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

    const runAnimationLoop = useCallback((): (() => void) => {
        // Reset all edges to default (non-animated, gray)
        setEdges(initialEdges.map(e => ({ ...e, animated: false, style: { stroke: '#b1b1b7' } })));

        const timeouts: ReturnType<typeof setTimeout>[] = [];

        // Sequential animation: frontend → backend (HTTP)
        timeouts.push(
            setTimeout(() => {
                setEdges(eds => eds.map(e =>
                    e.id === 'e1' ? { ...e, animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } } : e
                ));
            }, 500)
        );

        // backend → redis (Push Job)
        timeouts.push(
            setTimeout(() => {
                setEdges(eds => eds.map(e =>
                    e.id === 'e2' ? { ...e, animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } } : e
                ));
            }, 1500)
        );

        // redis → worker (Pop Job)
        timeouts.push(
            setTimeout(() => {
                setEdges(eds => eds.map(e =>
                    e.id === 'e3' ? { ...e, animated: true, style: { stroke: '#d97706', strokeWidth: 2 } } : e
                ));
            }, 2500)
        );

        // worker → db (Save Result)
        timeouts.push(
            setTimeout(() => {
                setEdges(eds => eds.map(e =>
                    e.id === 'e5' ? { ...e, animated: true, style: { stroke: '#2563eb', strokeWidth: 2 } } : e
                ));
            }, 4000)
        );

        // Loop: reset and start next cycle after 4500ms
        timeouts.push(
            setTimeout(() => {
                runAnimationLoop();
            }, 4500)
        );

        // Cleanup: clear all pending timeouts on unmount
        return () => {
            timeouts.forEach(t => clearTimeout(t));
        };
    }, [setEdges]);

    // Start animation loop on mount
    useEffect(() => {
        const cleanup = runAnimationLoop();
        return cleanup;
    }, [runAnimationLoop]);

    return (
        <div className="bg-[#fcfcfc] text-[#1a1a1a] min-h-screen font-sans flex flex-col lg:flex-row">
            {/* Left Panel: Diagram */}
            <div className="hidden lg:block lg:w-[35%] h-screen sticky top-0 border-r border-gray-200 bg-gray-50/50 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    attributionPosition="bottom-left"
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    zoomOnDoubleClick={false}
                    panOnDrag={false}
                    panOnScroll={false}
                    selectNodesOnDrag={false}
                    nodesFocusable={false}
                    edgesFocusable={false}
                >
                    <Background color="#e5e7eb" gap={20} />
                </ReactFlow>
            </div>

            {/* Right Panel: Content */}
            <div className="w-full lg:w-[65%] h-auto lg:h-screen overflow-y-auto">
                <div className="max-w-xl mx-auto px-8 py-24">
                    <header className="mb-16">
                        <p className="font-mono text-xs text-gray-500 mb-4 tracking-widest uppercase">
                            Case Study 002
                        </p>
                        <h1 className="font-serif text-4xl font-medium tracking-tight mb-6 text-gray-900">
                            Mobi: Microservices
                        </h1>
                        <a
                            href="https://github.com/d-aniel-yi/mobi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-500 text-xs font-mono tracking-wide uppercase rounded hover:border-gray-900 hover:text-gray-900 transition-colors whitespace-nowrap"
                            aria-label="View Mobi repository on GitHub"
                        >
                            <Github className="w-4 h-4" />
                            View on GitHub
                        </a>
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

                    <div className="mt-24 pt-8 border-t border-gray-200">
                        <a
                            href="https://github.com/d-aniel-yi/mobi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-500 text-xs font-mono tracking-wide uppercase rounded hover:border-gray-900 hover:text-gray-900 transition-colors"
                            aria-label="View Mobi repository on GitHub"
                        >
                            <Github className="w-4 h-4" />
                            View on GitHub
                        </a>
                    </div>

                    <div className="h-24" />
                </div>
            </div>
        </div>
    );
}
