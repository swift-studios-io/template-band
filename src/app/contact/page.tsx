import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/app/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | The Voltage",
  description:
    "Get in touch with The Voltage — book us for your next event or just say hello.",
  openGraph: {
    title: "Contact Us | The Voltage",
    description: "Get in touch with The Voltage — book us or say hello.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-white">
      <header className="fixed top-0 w-full z-40 bg-background/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors"
          >
            &larr; Back to Site
          </Link>
          <span className="font-heading text-sm font-black uppercase tracking-wider text-white/60">
            The Voltage
          </span>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-lg mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-wider text-white mb-3">
            Contact Us
          </h1>
          <p className="text-white/60 mb-10">
            Want to book us for your next event? Have a question?
            Just want to say hello? Drop us a line and we&apos;ll get back to you.
          </p>

          <ContactForm />

          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white/60 mb-4">
              Other Ways to Reach Us
            </h3>
            <div className="space-y-3 text-white/50 text-sm">
              <p>Follow us on social media for the latest updates and show announcements.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
