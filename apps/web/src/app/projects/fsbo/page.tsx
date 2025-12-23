"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ReactFlow, Background, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
    FileText,
    MapPin,
    Database,
    ArrowRight,
    Layers,
    Cpu,
    ShieldCheck,
    Code2
} from "lucide-react";

// --- Components ---

function BlueprintSection({ title, subtitle, children, className = "" }: { title: string, subtitle: string, children: React.ReactNode, className?: string }) {
    return (
        <section className={`min-h-screen flex flex-col justify-center py-24 border-b border-blue-900/30 relative ${className}`}>
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(#93c5fd 1px, transparent 1px), linear-gradient(90deg, #93c5fd 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
            />

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <div className="mb-12 border-l-2 border-blue-500 pl-6">
                    <h2 className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-2">{subtitle}</h2>
                    <h3 className="font-sans text-4xl md:text-5xl font-bold text-white tracking-tight">{title}</h3>
                </div>
                {children}
            </div>
        </section>
    );
}

// --- Layer 1: UX Logic Graph ---
const initialLogicNodes = [
    { id: 'start', position: { x: 0, y: 0 }, data: { label: 'Start Intake' }, style: { background: '#1e3a8a', color: '#fff', border: '1px solid #60a5fa' } },
    { id: 'q1', position: { x: 0, y: 100 }, data: { label: 'Is Condo?' }, style: { background: '#172554', color: '#93c5fd', border: '1px solid #1e40af' } },
    { id: 'condo_yes', position: { x: -150, y: 200 }, data: { label: 'Show HOA Fields' }, style: { background: '#064e3b', color: '#6ee7b7', border: '1px solid #059669' } },
    { id: 'condo_no', position: { x: 150, y: 200 }, data: { label: 'Skip HOA' }, style: { background: '#172554', color: '#93c5fd', border: '1px solid #1e40af' } },
    { id: 'q2', position: { x: 0, y: 300 }, data: { label: 'Has Tenant?' }, style: { background: '#172554', color: '#93c5fd', border: '1px solid #1e40af' } },
    { id: 'tenant_yes', position: { x: -150, y: 400 }, data: { label: 'Lease Upload' }, style: { background: '#064e3b', color: '#6ee7b7', border: '1px solid #059669' } },
    { id: 'end', position: { x: 0, y: 500 }, data: { label: 'Generate PDF' }, style: { background: '#1e3a8a', color: '#fff', border: '1px solid #60a5fa' } },
];
const initialLogicEdges = [
    { id: 'e1', source: 'start', target: 'q1', animated: true, style: { stroke: '#60a5fa' } },
    { id: 'e2', source: 'q1', target: 'condo_yes', label: 'Yes', style: { stroke: '#60a5fa' } },
    { id: 'e3', source: 'q1', target: 'condo_no', label: 'No', style: { stroke: '#60a5fa' } },
    { id: 'e4', source: 'condo_yes', target: 'q2', animated: true, style: { stroke: '#60a5fa' } },
    { id: 'e5', source: 'condo_no', target: 'q2', animated: true, style: { stroke: '#60a5fa' } },
    { id: 'e6', source: 'q2', target: 'tenant_yes', label: 'Yes', style: { stroke: '#60a5fa' } },
    { id: 'e7', source: 'q2', target: 'end', label: 'No', style: { stroke: '#60a5fa' } },
    { id: 'e8', source: 'tenant_yes', target: 'end', animated: true, style: { stroke: '#60a5fa' } },
];

function UXLayer() {
    const [nodes, , onNodesChange] = useNodesState(initialLogicNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialLogicEdges);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-[400px] bg-blue-950/50 border border-blue-900 rounded-lg overflow-hidden relative">
                <div className="absolute top-2 left-2 z-10 bg-blue-900/80 px-2 py-1 rounded text-xs text-blue-200 font-mono">Logic Flow Visualization</div>
                <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
                    <Background color="#1e40af" gap={20} size={1} />
                </ReactFlow>
            </div>
            <div className="space-y-6">
                <div className="flex items-start gap-4 pt-6 border-t border-blue-900/30">
                    <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-800">
                        <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">The Volume Problem</h4>
                        <p className="text-blue-200/80 leading-relaxed">
                            Just the listing contract form alone has over 750 possible fields and checkboxes, not all of which are relevant or required. If the whole point of this product is to be no-BS and simple for the users, we definitely can&apos;t ask them 18 pages worth of questions. Part of the challenge was filtering out which questions were necessary (not just from a legal standpoint, but to give the user the best chance at a successful listing), and part of the challenge was making the whole experience of filling out a form as pleasant as possible.
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-800">
                        <Layers className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">Conditional Complexity</h4>
                        <p className="text-blue-200/80 leading-relaxed">
                            The intake form isn&apos;t static. It&apos;s a state machine that adapts to user input, showing/hiding fields based on previous answers. Redundant questions are cumbersome for the user, and irrelevant questions are a waste of time, so I built smart javascript logic to make sure to keep the users on track.
                        </p>
                    </div>
                </div>
                <div className="p-4 bg-blue-950 border border-blue-900 rounded-lg font-mono text-sm text-blue-300">
                    <p className="mb-2 text-blue-500">{'// Example Logic Rule'}</p>
                    <p>if (property.type === &apos;CONDO&apos;) &#123;</p>
                    <p className="pl-4">requirements.add(&apos;HOA_CONTACT&apos;);</p>
                    <p className="pl-4">pages.show(&apos;STRATA_DOCS&apos;);</p>
                    <p>&#125;</p>
                </div>


            </div>
        </div>
    );
}

// --- Layer 2: Address Parser ---
import { parseAddress } from "@/lib/address-parser";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        google: any;
        initAutocomplete?: () => void;
    }
}

// Placeholder for Google Maps API key - user needs to provide this
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

function DataLayer() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [parsed, setParsed] = useState<any>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autocompleteRef = useRef<any>(null);
    const inputWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrapper = inputWrapperRef.current;
        if (!wrapper) return;

        const stopPropagation = (e: Event) => e.stopPropagation();

        // Stop both keydown and keyup to prevent React Flow from catching Backspace/Delete
        wrapper.addEventListener('keydown', stopPropagation);
        wrapper.addEventListener('keyup', stopPropagation);

        return () => {
            wrapper.removeEventListener('keydown', stopPropagation);
            wrapper.removeEventListener('keyup', stopPropagation);
        };
    }, [scriptLoaded]);

    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) {
            console.warn('Google Maps API Key missing');
            return;
        }

        const checkLoaded = () => {
            if (window.google?.maps?.places?.PlaceAutocompleteElement) {
                setScriptLoaded(true);
                return true;
            }
            return false;
        };

        if (checkLoaded()) return;

        const SCRIPT_ID = 'google-maps-script';
        let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement;

        if (!script) {
            script = document.createElement('script');
            script.id = SCRIPT_ID;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=initAutocomplete`;
            script.async = true;
            script.defer = true;

            window.initAutocomplete = () => {
                setScriptLoaded(true);
            };

            document.body.appendChild(script);
        } else {
            const intervalId = setInterval(() => {
                if (checkLoaded()) {
                    clearInterval(intervalId);
                }
            }, 100);
            return () => clearInterval(intervalId);
        }
    }, []);

    useEffect(() => {
        if (!scriptLoaded || !autocompleteRef.current) return;

        const element = autocompleteRef.current;
        console.log('Setting up Google Maps autocomplete listener', element);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const listener = async (event: any) => {
            console.log('Place selected event fired', event);

            // Get the place prediction from the event
            const placePrediction = event.placePrediction;
            if (!placePrediction) {
                console.warn('No placePrediction in event');
                return;
            }

            try {
                // Convert prediction to Place object
                const place = placePrediction.toPlace();
                console.log('Place object created:', place);

                // Fetch necessary fields
                await place.fetchFields({
                    fields: ['addressComponents', 'formattedAddress', 'location']
                });

                console.log('Place details fetched:', place);
                const parsedResult = parseAddress(place.addressComponents, place.formattedAddress);
                console.log('Parsed result:', parsedResult);
                setParsed(parsedResult);
            } catch (error) {
                console.error("Error fetching place details:", error);
            }
        };

        element.addEventListener('gmp-select', listener);

        return () => {
            element.removeEventListener('gmp-select', listener);
        };
    }, [scriptLoaded]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-800">
                        <MapPin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">Normalization Engine</h4>
                        <p className="text-blue-200/80 leading-relaxed">
                            User input is messy. I integrated with the Google Maps API to validate addresses in real-time and built a parsing algorithm. This ensures that &quot;123 Main St&quot; and &quot;123 Main Street&quot;
                            resolve to the same canonical entity in the database and the pieces of the address are stored in their respective stable keys.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-950/50 border border-blue-900 rounded-lg p-6 order-1 lg:order-2">
                <label className="block text-xs font-mono text-blue-400 mb-2 uppercase">Raw User Input</label>

                <div className="mb-8">
                    {scriptLoaded ? (
                        <div
                            ref={inputWrapperRef}
                            className="relative"
                        >
                            {/* @ts-expect-error - Web Component */}
                            <gmp-place-autocomplete
                                ref={autocompleteRef}
                                placeholder="Enter an address..."
                            />
                            <style jsx global>{`
                                gmp-place-autocomplete {
                                    width: 100%;
                                    display: block;
                                }
                                gmp-place-autocomplete input {
                                    width: 100% !important;
                                    height: 48px !important;
                                    border-radius: 0.5rem !important;
                                    border: 1px solid #1e3a8a !important;
                                    background-color: rgba(30, 58, 138, 0.2) !important;
                                    color: white !important;
                                    padding: 0 1rem !important;
                                    font-size: 1rem !important;
                                    font-family: monospace !important;
                                }
                                gmp-place-autocomplete input::placeholder {
                                    color: rgba(255, 255, 255, 0.5) !important;
                                }
                                gmp-place-autocomplete input:focus {
                                    outline: none !important;
                                    border-color: #3b82f6 !important;
                                }
                            `}</style>
                        </div>
                    ) : (
                        <input
                            disabled
                            placeholder={GOOGLE_MAPS_API_KEY ? "Loading maps..." : "API Key Missing"}
                            className="w-full bg-blue-900/20 border border-blue-800 rounded p-3 text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    )}
                    {!GOOGLE_MAPS_API_KEY && (
                        <p className="text-xs text-red-400 mt-2 font-mono">
                            Warning: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not found.
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-mono text-blue-400 mb-2 uppercase">Normalized Data Object</label>
                    <div className="grid grid-cols-2 gap-4">
                        {parsed ? Object.entries(parsed).map(([key, value]) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-blue-900/40 p-3 rounded border border-blue-800/50"
                            >
                                <span className="block text-[10px] text-blue-500 uppercase font-bold mb-1">{key}</span>
                                <span className="font-mono text-sm text-blue-100 break-all">{String(value)}</span>
                            </motion.div>
                        )) : (
                            <div className="col-span-2 p-4 text-center text-blue-500/50 font-mono text-sm border border-dashed border-blue-900 rounded">
                                Waiting for valid address selection...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Layer 3: Stable Keys ---
function KeyLayer() {
    return (
        <div className="space-y-12">
            <div className="max-w-3xl">
                <h4 className="text-xl font-bold text-white mb-4">The &quot;Rosetta Stone&quot; Architecture</h4>
                <p className="text-blue-200/80 leading-relaxed">
                    The biggest challenge was bridging the gap between a modern, flexible database schema
                    and the rigid, legacy field names of PDF forms (Acroforms). I created a &quot;Stable Key&quot;
                    system to map user input to the correct database fields.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-mono">
                {/* Column 1: User Input */}
                <div className="space-y-4">
                    <div className="text-blue-400 text-xs uppercase tracking-widest border-b border-blue-800 pb-2">1. User Input</div>
                    <div className="p-3 bg-blue-900/20 border border-blue-800 rounded text-white">&quot;John Doe&quot;</div>
                    <div className="p-3 bg-blue-900/20 border border-blue-800 rounded text-white">&quot;123 Main St&quot;</div>
                    <div className="p-3 bg-blue-900/20 border border-blue-800 rounded text-white">&quot;$500,000&quot;</div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-col justify-center items-center space-y-8 opacity-50">
                    <ArrowRight className="text-blue-500" />
                    <ArrowRight className="text-blue-500" />
                    <ArrowRight className="text-blue-500" />
                </div>

                {/* Column 2: Stable Key */}
                <div className="space-y-4">
                    <div className="text-yellow-500 text-xs uppercase tracking-widest border-b border-blue-800 pb-2">2. Stable Key</div>
                    <div className="p-3 bg-yellow-900/10 border border-yellow-700/50 rounded text-yellow-200">owner</div>
                    <div className="p-3 bg-yellow-900/10 border border-yellow-700/50 rounded text-yellow-200">address_street</div>
                    <div className="p-3 bg-yellow-900/10 border border-yellow-700/50 rounded text-yellow-200">price</div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-col justify-center items-center space-y-8 opacity-50">
                    <ArrowRight className="text-blue-500" />
                    <ArrowRight className="text-blue-500" />
                    <ArrowRight className="text-blue-500" />
                </div>

                {/* Column 3: Acroform Field */}
                <div className="space-y-4">
                    <div className="text-green-400 text-xs uppercase tracking-widest border-b border-blue-800 pb-2">3. PDF Target</div>
                    <div className="p-3 bg-green-900/10 border border-green-700/50 rounded text-green-200">form1[0].Page1[0].Name[0]</div>
                    <div className="p-3 bg-green-900/10 border border-green-700/50 rounded text-green-200">form1[0].Page1[0].Addr[0]</div>
                    <div className="p-3 bg-green-900/10 border border-green-700/50 rounded text-green-200">form1[0].Page1[0].Amt[0]</div>
                </div>
            </div>
        </div>
    );
}

// --- Layer 4: PDF Assembler ---
function PDFLayer() {
    const [text, setText] = useState("John Smith");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-1 rounded shadow-2xl rotate-1 lg:rotate-2 transition-transform duration-500 hover:rotate-0 relative h-[500px] w-full max-w-md mx-auto">
                {/* PDF Mockup */}
                <div className="bg-white h-full w-full border border-gray-200 p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                    <h3 className="font-serif text-2xl text-gray-900 mb-8 border-b pb-4">Listing Agreement</h3>

                    <div className="space-y-6 text-gray-300 text-xs font-mono select-none">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="h-2 bg-gray-100 rounded w-full"></div>
                        ))}
                    </div>

                    {/* Dynamic Field Overlay */}
                    <motion.div
                        className="absolute top-[180px] left-[40px] border-2 border-blue-500 bg-blue-500/10 px-2 py-1 text-blue-700 font-serif text-lg font-bold"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={text}
                    >
                        {text || "________"}
                    </motion.div>

                    <div className="absolute top-[160px] left-[40px] text-[10px] text-blue-500 font-mono uppercase tracking-wider">
                        Mapped: owner
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-800">
                        <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">The PDF Assembler</h4>
                        <p className="text-blue-200/80 leading-relaxed">
                            The stakes are high - selling a home is a big deal, and it's often the largest financial decision that a person will make in their lifetime, so it's important to get this right. These are legally binding documents, and I have to make sure that the system is robust enough to handle all cases. Once the data structure is in place and the data is captured, we have to make sure that it is properly printed on the document. The RMLS and uploading team require these contracts to be filled out, and our system allows for this to happen in a more user-friendly manner.
                        </p>
                        <br></br>
                        <p className="text-blue-200/80 leading-relaxed">
                            I manually created acroform fields on the blank contract template, mapped each stable key to the correct acroform field, and created a script to generate a coordinate mapping of all of the different acroform fields. The system queries the database, pulls the correct data that corresponds to each stable key, and prints it according to the generated coordinate system using &apos;pdf-lib&apos;.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-blue-950 border border-blue-900 rounded-lg">
                    <label className="block text-xs font-mono text-blue-400 mb-2 uppercase">Live Data Injection</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a name..."
                        className="w-full bg-blue-900/20 border border-blue-800 rounded p-3 text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <p className="mt-2 text-xs text-blue-500 font-mono">Try typing to see the PDF update instantly.</p>
                </div>
            </div>
        </div>
    );
}

// --- Layer 5: Infrastructure ---
const infraNodes = [
    { id: 'client', position: { x: 0, y: 0 }, data: { label: 'Next.js Client' }, style: { background: '#fff', color: '#000', border: '1px solid #ccc' } },
    { id: 'api', position: { x: 0, y: 150 }, data: { label: 'API Routes' }, style: { background: '#1e3a8a', color: '#fff', border: '1px solid #60a5fa' } },
    { id: 'supabase', position: { x: -150, y: 300 }, data: { label: 'Supabase (DB/Auth)' }, style: { background: '#064e3b', color: '#6ee7b7', border: '1px solid #059669' } },
    { id: 'stripe', position: { x: 150, y: 300 }, data: { label: 'Stripe' }, style: { background: '#4c1d95', color: '#c4b5fd', border: '1px solid #8b5cf6' } },
    { id: 'docusign', position: { x: 0, y: 450 }, data: { label: 'DocuSign (Planned)' }, style: { background: '#7f1d1d', color: '#fca5a5', border: '1px solid #f87171' } },
];
const infraEdges = [
    { id: 'e1', source: 'client', target: 'api', animated: true, style: { stroke: '#60a5fa' } },
    { id: 'e2', source: 'api', target: 'supabase', animated: true, style: { stroke: '#60a5fa' } },
    { id: 'e3', source: 'api', target: 'stripe', animated: true, style: { stroke: '#60a5fa' } },
    { id: 'e4', source: 'api', target: 'docusign', animated: false, style: { stroke: '#60a5fa', strokeDasharray: '5 5' } },
];

function InfraLayer() {
    const [nodes, , onNodesChange] = useNodesState(infraNodes);
    const [edges, , onEdgesChange] = useEdgesState(infraEdges);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-800">
                        <Cpu className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">Full Stack Infrastructure</h4>
                        <p className="text-blue-200/80 leading-relaxed">
                            I built the system on a robust, serverless architecture. Next.js handles the frontend
                            and API orchestration, while Supabase provides the relational database and authentication.
                            I integrated external services like Stripe and DocuSign via secure webhooks.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-950 border border-blue-900 rounded flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-blue-200">Auth & RLS</span>
                    </div>
                    <div className="p-4 bg-blue-950 border border-blue-900 rounded flex items-center gap-3">
                        <Database className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-blue-200">Postgres DB</span>
                    </div>
                    <div className="p-4 bg-blue-950 border border-blue-900 rounded flex items-center gap-3">
                        <Code2 className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-blue-200">TypeScript</span>
                    </div>
                </div>
            </div>

            <div className="h-[400px] bg-blue-950/50 border border-blue-900 rounded-lg overflow-hidden relative">
                <div className="absolute top-2 left-2 z-10 bg-blue-900/80 px-2 py-1 rounded text-xs text-blue-200 font-mono">System Architecture</div>
                <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
                    <Background color="#1e40af" gap={20} size={1} />
                </ReactFlow>
            </div>
        </div>
    );
}

// --- Main Page ---

export default function FSBODemoPage() {
    return (
        <div className="bg-[#0f172a] min-h-screen font-sans text-blue-100 selection:bg-blue-500/30">

            {/* Header */}
            <header className="pt-32 pb-16 px-6 max-w-7xl mx-auto border-b border-blue-900/30">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 mb-8">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-blue-300 font-medium">
                        System Anatomy
                    </span>
                </div>
                <h1 className="font-sans text-6xl md:text-7xl font-bold tracking-tight text-white mb-6">
                    Flat Fee MLS Platform
                </h1>
                <p className="text-xl text-blue-300/60 max-w-2xl font-light leading-relaxed">
                    A no-nonsense solution allowing homeowners to list directly on the MLS for a flat fee.
                    I built this to remove the barrier to entry and provide a genuine tool for self-sellers,
                    replacing &quot;lead gen&quot; tactics with an easy to use, no-BS approach. This is a showcase of a few of the technical problems I faced, and how I tackled them.
                </p>
            </header>

            {/* Layers */}
            <BlueprintSection title="The UX Challenge" subtitle="Layer 01">
                <UXLayer />
            </BlueprintSection>

            <BlueprintSection title="Data Normalization" subtitle="Layer 02">
                <DataLayer />
            </BlueprintSection>

            <BlueprintSection title="Stable Key Architecture" subtitle="Layer 03">
                <KeyLayer />
            </BlueprintSection>

            <BlueprintSection title="PDF Assembly" subtitle="Layer 04">
                <PDFLayer />
            </BlueprintSection>

            <BlueprintSection title="Infrastructure" subtitle="Layer 05">
                <InfraLayer />
            </BlueprintSection>

            <div className="h-32 bg-[#0f172a]"></div>
        </div>
    );
}
