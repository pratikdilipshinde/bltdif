"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Clock3,
  Headphones,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import PageHero from "../components/marketing/PageHero";
import AnnouncementBar from "../components/AnnouncementBar";

const BRAND_RED = "#CE0028";

const glassPanel =
  "border border-white/80 bg-white/[0.48] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_18px_55px_rgba(0,0,0,0.055)] backdrop-blur-2xl";

const supportTopics = [
  "Sizing",
  "Order Status",
  "Returns",
  "Product Details",
];

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
    <>
    <AnnouncementBar />
    <main className="relative isolate overflow-hidden bg-[#f4f3f2] text-black pt-15 md:pt-10">
      {/* Ambient glassmorphism background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-40 top-[350px] h-[420px] w-[420px] rounded-full blur-[120px]"
          style={{ background: "rgba(206,0,40,0.09)" }}
        />

        <div className="absolute -right-40 top-[800px] h-[500px] w-[500px] rounded-full bg-white/90 blur-[120px]" />

        <div
          className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full blur-[110px]"
          style={{ background: "rgba(206,0,40,0.055)" }}
        />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.14) 0.6px, transparent 0.6px)",
            backgroundSize: "7px 7px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        {/* <PageHero
          kicker="BLTDIF · SUPPORT"
          title="Contact us"
          subtitle="Sizing help, product questions, or order support — message us anytime."
          image="/images/contact-hero.jpg"
        /> */}

        {/* Contact section */}
        <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:py-20 lg:px-10">
          {/* Section introduction */}
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="h-[2px] w-8"
                  style={{ backgroundColor: BRAND_RED }}
                />

                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
                  We're here for you
                </p>
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl md:text-5xl">
                Let's talk.
                <span style={{ color: BRAND_RED }}> We're listening.</span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-black/55">
              Have a question about your order or a product? Send us a message
              and our team will help you out.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            {/* Support / image panel */}
            <div
              className={`group relative flex flex-col overflow-hidden rounded-[28px] p-3 sm:rounded-[34px] sm:p-4 ${glassPanel}`}
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/80 blur-[90px]" />

              {/* Image */}
              <div className="relative h-[300px] overflow-hidden rounded-[21px] sm:h-[400px] lg:h-[480px]">
                <Image
                  src="/images/photo-5.jpg"
                  alt="Support"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-white/10" />

                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />

                {/* Image label */}
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 sm:inset-x-7 sm:bottom-7">
                  <div className="rounded-2xl border border-white/30 bg-black/20 px-4 py-3 text-white shadow-lg backdrop-blur-xl sm:px-5">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/70">
                      BLTDIF support
                    </p>

                    <p className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                      Here to help.
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-xl transition-transform duration-300 group-hover:rotate-12">
                    <MessageCircle size={19} />
                  </div>
                </div>
              </div>

              {/* Support information */}
              <div className="relative flex-1 p-4 pt-6 sm:p-6 sm:pt-7">
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: BRAND_RED }}
                  />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
                    Support
                  </p>
                </div>

                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                  We reply fast.
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-6 text-black/60">
                  Typical response time: 24–48 hours. Include your order number
                  if available.
                </p>

                {/* Topics */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {supportTopics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/90 bg-white/[0.55] px-3.5 py-2 text-[11px] font-medium text-black/65 shadow-[0_3px_12px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Response time */}
                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/85 bg-white/[0.42] p-4 backdrop-blur-xl">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-white/70 text-black/65 shadow-sm">
                    <Clock3 size={19} strokeWidth={1.6} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-black/80">
                      Typical response time
                    </p>

                    <p className="mt-1 text-xs text-black/50">
                      24–48 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form panel */}
            <div
              className={`relative overflow-hidden rounded-[28px] p-5 sm:rounded-[34px] sm:p-8 md:p-10 ${glassPanel}`}
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/80 blur-[90px]" />

              <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-rose-200/30 blur-[90px]" />

              <div className="relative">
                {/* Form heading */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className="h-[2px] w-7"
                        style={{ backgroundColor: BRAND_RED }}
                      />

                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
                        Send a message
                      </p>
                    </div>

                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
                      How can we help?
                    </h2>
                  </div>

                  <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white bg-white/60 text-black/60 shadow-sm backdrop-blur-xl sm:flex">
                    <Headphones size={21} strokeWidth={1.5} />
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-black/55">
                  Fill in the details below and we'll get back to you.
                </p>

                {/* Success message */}
                {sent && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/75 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-white/70">
                        <ShieldCheck
                          size={17}
                          className="text-emerald-700"
                        />
                      </div>

                      <p className="pt-1 text-sm leading-6 text-emerald-800">
                        Your message has been sent successfully. We’ll get
                        back to you soon.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div
                    role="alert"
                    className="mt-6 rounded-2xl border border-red-200/80 bg-red-50/75 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-xl"
                  >
                    <p className="text-sm leading-6 text-red-700">{error}</p>
                  </div>
                )}

                {/* Contact form */}
                <form
                  className="mt-7 grid grid-cols-1 gap-5"
                  onSubmit={handleSubmit}
                >
                  <Field
                    name="name"
                    label="Full name"
                    placeholder="Full Name"
                  />

                  <Field
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@domain.com"
                  />

                  <Field
                    name="subject"
                    label="Subject"
                    placeholder="Order / Size / Product question"
                  />

                  <TextArea
                    name="message"
                    label="Message"
                    placeholder="Write your message..."
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="group cursor-pointer relative mt-1 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-white/30 px-6 py-4 text-[12px] font-semibold text-white shadow-[0_12px_30px_rgba(206,0,40,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(206,0,40,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)`,
                    }}
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative">
                      {loading ? "Sending..." : "Send Message"}
                    </span>

                    {!loading && (
                      <ArrowRight
                        size={15}
                        className="relative transition-transform duration-300 group-hover:translate-x-1"
                      />
                    )}
                  </button>

                  <p className="text-center text-[11px] leading-relaxed text-black/50 sm:text-xs">
                    By sending, you agree to be contacted regarding your
                    request.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    </>
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
      <label
        htmlFor={name}
        className="mb-2 block text-[12px] font-semibold tracking-wide text-black/75"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="w-full rounded-2xl border border-white/90 bg-white/[0.52] px-4 py-3.5 text-[13px] text-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.025),0_3px_12px_rgba(0,0,0,0.02)] outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-black/35 hover:bg-white/[0.72] focus:border-[#CE0028]/40 focus:bg-white/[0.82] focus:shadow-[0_0_0_3px_rgba(206,0,40,0.06)]"
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
      <label
        htmlFor={name}
        className="mb-2 block text-[12px] font-semibold tracking-wide text-black/75"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        required
        className="min-h-[150px] w-full resize-y rounded-2xl border border-white/90 bg-white/[0.52] px-4 py-3.5 text-[13px] leading-6 text-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.025),0_3px_12px_rgba(0,0,0,0.02)] outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-black/35 hover:bg-white/[0.72] focus:border-[#CE0028]/40 focus:bg-white/[0.82] focus:shadow-[0_0_0_3px_rgba(206,0,40,0.06)]"
      />
    </div>
  );
}
