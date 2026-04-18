"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import PageHero from "../components/marketing/PageHero";

const BRAND_RED = "#CE0028";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const emailInvalid = useMemo(() => {
    if (!email) return false;
    return !/^\S+@\S+\.\S+$/.test(email);
  }, [email]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset email.");
        return;
      }

      setMessage(
        data.message || "Password reset link sent successfully. Please check your email."
      );
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · ACCOUNT RECOVERY"
        title="FORGOT PASSWORD"
        subtitle="Reset your password securely and get back into your BLTDIF account without the friction."
        image=""
        primaryCta={{ label: "Back to Home", href: "/" }}
        secondaryCta={{ label: "Need Help?", href: "/contact" }}
      />

      <section className="w-full border-y border-black/10 bg-black/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-black/45">
              Password assistance
            </p>

            <h2 className="mt-3 text-3xl font-semibold leading-tight text-black md:text-4xl">
              Lost access?{" "}
              <span style={{ color: BRAND_RED }}>recover it clean.</span>
            </h2>

            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-black/70 md:text-[15px]">
              <li className="flex gap-3">
                <Dot />
                Enter the email connected to your BLTDIF account.
              </li>
              <li className="flex gap-3">
                <Dot />
                We’ll send a secure reset link to that inbox.
              </li>
              <li className="flex gap-3">
                <Dot />
                Open the email and continue to the reset page.
              </li>
              <li className="flex gap-3">
                <Dot />
                Create a new password and sign back in.
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-xs px-6 py-3 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
                style={{ background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)` }}
              >
                Back to login
              </Link>

              <Link
                href="/contact"
                className="rounded-xs border border-black/15 bg-white px-6 py-3 text-[12px] font-semibold text-black transition hover:bg-black/[0.02]"
              >
                Contact support
              </Link>
            </div>
          </div>

          <div className="rounded-xs border border-black/10 bg-white p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Enter your email
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-black">
              Send reset link
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Use the email you registered with. We’ll send a password reset link if
              your account exists.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[13px] font-semibold text-black/85"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    if (error) setError("");
                    if (message) setMessage("");
                    setEmail(e.target.value);
                  }}
                  placeholder="you@example.com"
                  className={`
                    w-full rounded-xs border bg-black/[0.03]
                    px-4 py-3 text-[13px] text-black placeholder:text-black/35
                    outline-none transition
                    ${
                      emailInvalid
                        ? "border-red-500/60 focus:border-red-500/70"
                        : "border-black/10 focus:border-[#CE0028]/40"
                    }
                    focus:bg-black/[0.045]
                  `}
                />
                {emailInvalid ? (
                  <p className="mt-1 text-[12px] text-red-600">
                    Please enter a valid email address.
                  </p>
                ) : null}
              </div>

              {message ? (
                <div className="rounded-xs border border-green-500/25 bg-green-50 px-4 py-3 text-[13px] text-green-700">
                  {message}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-xs border border-red-500/25 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading || !email || emailInvalid}
                className={`
                  w-full rounded-xs py-3 text-[13px] font-semibold text-white
                  shadow-[0_18px_60px_rgba(0,0,0,0.10)]
                  ${
                    loading || !email || emailInvalid
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }
                `}
                style={{ background: "black" }}
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <div className="pt-1 text-sm text-black/60">
                Remember your password?{" "}
                <Link
                  href="/"
                  className="font-semibold underline underline-offset-4"
                  style={{ color: BRAND_RED }}
                >
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard
            title="Registered Email"
            desc="Use the same email address you used to create your BLTDIF account."
          />
          <InfoCard
            title="Email Delivery"
            desc="If you don’t see the message, check your spam or promotions folder."
          />
          <InfoCard
            title="Link Validity"
            desc="Use the reset link as soon as you receive it for the smoothest recovery flow."
          />
          <InfoCard
            title="Need Help?"
            desc="If you’re still having trouble accessing your account, contact BLTDIF support."
          />
        </div>
      </section>
    </main>
  );
}

function Dot() {
  return (
    <span
      className="mt-2 h-2 w-2 rounded-full"
      style={{ backgroundColor: BRAND_RED }}
    />
  );
}

function StatCard({
  title,
  value,
  desc,
}: {
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="rounded-xs border border-black/10 bg-white p-6 transition hover:shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
        {title}
      </p>
      <p className="mt-3 text-xl font-semibold text-black">{value}</p>
      <p className="mt-2 text-sm leading-relaxed text-black/60">{desc}</p>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xs border border-black/10 bg-white p-6">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: BRAND_RED }}
        />
        <p className="text-sm font-semibold text-black">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-black/70">{desc}</p>
    </div>
  );
}