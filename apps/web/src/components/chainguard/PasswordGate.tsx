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
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--cg-black) 0%, var(--cg-dark-gray) 100%)' }}>
      <div className="max-w-md w-full mx-4">
        <div className="rounded-2xl shadow-xl p-8 border" style={{ backgroundColor: 'var(--cg-white)', borderColor: 'var(--cg-gray)' }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--cg-light-gray)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--cg-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--cg-black)' }}>Protected Content</h1>
            <p className="text-sm" style={{ color: 'var(--cg-gray)' }}>Enter the password to view this presentation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full px-4 py-3 rounded-lg border transition ${
                  error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                } focus:outline-none`}
                style={!error ? { 
                  borderColor: 'var(--cg-gray)',
                } : {}}
                onFocus={(e) => {
                  if (!error) {
                    e.target.style.borderColor = 'var(--cg-primary)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(0, 102, 255, 0.2)';
                  }
                }}
                onBlur={(e) => {
                  if (!error) {
                    e.target.style.borderColor = 'var(--cg-gray)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">Incorrect password. Please try again.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full text-white py-3 rounded-lg font-medium transition active:scale-[0.98]"
              style={{ backgroundColor: 'var(--cg-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cg-primary-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--cg-primary)'}
            >
              Access Presentation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

