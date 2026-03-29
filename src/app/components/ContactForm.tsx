"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: string;
          size?: string;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface ContactFormProps {
  modal?: boolean;
  onClose?: () => void;
  isOpen?: boolean;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm({
  modal = false,
  onClose,
  isOpen = true,
}: ContactFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.querySelector('script[src*="turnstile"]')) return;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isOpen || !turnstileRef.current) return;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current) return;
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
        callback: (token: string) => setTurnstileToken(token),
        "error-callback": () => setTurnstileToken(null),
        "expired-callback": () => setTurnstileToken(null),
        theme: "dark",
        size: "compact",
      });
    };

    const interval = setInterval(() => {
      if (window.turnstile) {
        renderWidget();
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [isOpen]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
    setTurnstileToken(null);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          message,
          turnstileToken,
          website: (formRef.current?.querySelector('input[name="website"]') as HTMLInputElement)
            ?.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      resetForm();

      if (modal && onClose) {
        setTimeout(() => {
          onClose();
          setStatus("idle");
        }, 3000);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  const formContent = (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-first-name" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-1.5">
            First Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="contact-first-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/30 focus:border-primary focus:outline-none transition-colors"
            placeholder="First name"
            disabled={status === "submitting"}
          />
        </div>
        <div>
          <label htmlFor="contact-last-name" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-1.5">
            Last Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="contact-last-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/30 focus:border-primary focus:outline-none transition-colors"
            placeholder="Last name"
            disabled={status === "submitting"}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-1.5">
          Email <span className="text-primary">*</span>
        </label>
        <input
          type="email"
          id="contact-email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/30 focus:border-primary focus:outline-none transition-colors"
          placeholder="your@email.com"
          disabled={status === "submitting"}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-bold uppercase tracking-wider text-white/80 mb-1.5">
          Message <span className="text-primary">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/30 focus:border-primary focus:outline-none transition-colors resize-none"
          placeholder="How can we help?"
          disabled={status === "submitting"}
        />
      </div>

      <div ref={turnstileRef} />

      {status === "error" && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {status === "success" && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          Message sent! We&apos;ll get back to you soon.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full px-8 py-3 bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider transition-colors"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );

  if (!modal) {
    return formContent;
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-dark border border-white/10 p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          aria-label="Close contact form"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-heading text-2xl font-black uppercase tracking-wider text-white mb-6">
          Get in Touch
        </h2>

        {formContent}
      </div>
    </div>
  );
}
