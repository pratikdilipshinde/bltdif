"use client";

import { useState } from "react";
import Image from "next/image";
import PageHero from "../components/marketing/PageHero";

const BRAND_RED = "#CE0028";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message.");
      }

      setSent(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · SUPPORT"
        title="Contact us"
        subtitle="Sizing help, product questions, or order support — message us anytime."
        image="/images/contact-hero.jpg"
      />

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div className="rounded-xs overflow-hidden border border-black/10 bg-black/[0.02]">
            <div className="relative h-[360px] md:h-[540px]">
              <Image src="/images/photo-5.jpg" alt="Support" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-black/45">Support</p>
              <h2 className="mt-2 text-xl font-semibold text-black">We reply fast.</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/60">
                Typical response time: 24–48 hours. Include your order number if available.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Sizing", "Order Status", "Returns", "Product Details"].map((t) => (
                  <span
                    key={t}
                    className="rounded-xs border border-black/10 bg-white px-3 py-1 text-[12px] text-black/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xs border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-black/45">Send a message</p>
            <h2 className="mt-3 text-2xl font-semibold text-black">How can we help?</h2>

            {sent && (
              <div className="mt-5 rounded-sm border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-green-700">
                  Your message has been sent successfully. We’ll get back to you soon.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-sm border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form className="mt-6 grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
              <Field name="name" label="Full name" placeholder="Full Name" />
              <Field name="email" label="Email" type="email" placeholder="you@domain.com" />
              <Field name="subject" label="Subject" placeholder="Order / Size / Product question" />
              <TextArea name="message" label="Message" placeholder="Write your message..." />

              <button
                type="submit"
                disabled={loading}
                className="rounded-xs px-6 py-3 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.10)] disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)` }}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              <p className="text-[12px] leading-relaxed text-black/55">
                By sending, you agree to be contacted regarding your request.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-semibold text-black/85">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="
          w-full rounded-xs border border-black/10 bg-black/[0.03]
          px-4 py-2.5 text-[13px] text-black placeholder:text-black/35
          outline-none transition focus:border-[#CE0028]/45 focus:bg-black/[0.045]
        "
      />
    </div>
  );
}

function TextArea({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-semibold text-black/85">{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        required
        className="
          min-h-[140px] w-full rounded-xs border border-black/10 bg-black/[0.03]
          px-4 py-3 text-[13px] text-black placeholder:text-black/35
          outline-none transition focus:border-[#CE0028]/45 focus:bg-black/[0.045]
        "
      />
    </div>
  );
}