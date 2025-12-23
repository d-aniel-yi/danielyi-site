"use client";

import { useState } from "react";

interface PasswordGateProps {
    onSubmit: (password: string) => boolean;
}

export function PasswordGate({ onSubmit }: PasswordGateProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = onSubmit(password);
        if (!success) {
            setError(true);
            setPassword("");
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0C15] text-white">
            <div className="max-w-md w-full mx-4">
                <div className="bg-[#151621] rounded-2xl shadow-xl p-8 border border-[#2D3436]">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2D3436] mb-4">
                            <svg className="w-8 h-8 text-[#A29BFE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-semibold mb-2">Protected Content</h1>
                        <p className="text-[#B2BEC3] text-sm">Enter the password to view this presentation</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-400 bg-red-900/10' : 'border-[#2D3436] bg-[#0B0C15]'
                                    } focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition text-white placeholder-gray-500`}
                                autoFocus
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-400">Incorrect password. Please try again.</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#6C5CE7] text-white py-3 rounded-lg font-medium hover:bg-[#4834D4] transition active:scale-[0.98]"
                        >
                            Access Presentation
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
