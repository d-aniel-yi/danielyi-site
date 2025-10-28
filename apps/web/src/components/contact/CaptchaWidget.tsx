"use client";

/**
 * Cloudflare Turnstile CAPTCHA Widget
 * 
 * CAPTCHA is currently DISABLED by default.
 * To enable, set NEXT_PUBLIC_ENABLE_CAPTCHA=true in .env.local
 * and provide NEXT_PUBLIC_TURNSTILE_SITE_KEY
 * 
 * Turnstile is free and privacy-friendly.
 * Sign up: https://dash.cloudflare.com/sign-up/turnstile
 */

import { useEffect, useRef, useState } from 'react';

export interface CaptchaWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

export function CaptchaWidget({ onVerify, onError, onExpire }: CaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if CAPTCHA is enabled
    const enabled = process.env.NEXT_PUBLIC_ENABLE_CAPTCHA === 'true';
    setIsEnabled(enabled);

    if (!enabled) {
      // Auto-verify if CAPTCHA is disabled
      onVerify('disabled');
      return;
    }

    // Load Turnstile script
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      console.error('CAPTCHA enabled but NEXT_PUBLIC_TURNSTILE_SITE_KEY not set');
      onError?.();
      return;
    }

    interface WindowWithTurnstile extends Window {
      turnstile?: {
        render: (container: HTMLElement, options: Record<string, unknown>) => void;
      };
    }

    if (!(window as WindowWithTurnstile).turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, [onVerify, onError]);

  useEffect(() => {
    if (!isLoaded || !isEnabled || !containerRef.current) return;

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;
    interface WindowWithTurnstile extends Window {
      turnstile?: {
        render: (container: HTMLElement, options: Record<string, unknown>) => void;
      };
    }
    const turnstile = (window as WindowWithTurnstile).turnstile;

    if (!turnstile) return;

    turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => onVerify(token),
      'error-callback': () => onError?.(),
      'expired-callback': () => onExpire?.(),
      theme: 'light',
      size: 'normal',
    });
  }, [isLoaded, isEnabled, onVerify, onError, onExpire]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="my-4">
      <div ref={containerRef} className="cf-turnstile" />
      {!isLoaded && (
        <div className="text-sm text-black/50">Loading verification...</div>
      )}
    </div>
  );
}

