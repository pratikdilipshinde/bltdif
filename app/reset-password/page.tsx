"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHero from "../components/marketing/PageHero";

const BRAND_RED = "#CE0028";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showCnfmPwd, setShowCnfmPwd] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.substring(1)
      : "";

    const params = new URLSearchParams(hash);

    const token = params.get("access_token");
    const refresh = params.get("refresh_token");
    const type = params.get("type");

    if (type === "recovery" && token && refresh) {
      setAccessToken(token);
      setRefreshToken(refresh);
    } else {
      setError("Invalid or expired reset link.");
    }

    setCheckingLink(false);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!password) {
      setError("Password is required.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!accessToken || !refreshToken) {
      setError("Invalid or expired reset link.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          confirmPassword,
          access_token: accessToken,
          refresh_token: refreshToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
        return;
      }

      setMessage("Password updated successfully. Redirecting to login...");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · RESET PASSWORD"
        title="SET NEW PASSWORD"
        subtitle="Secure your account with a new password and get back to BLTDIF with zero friction."
        image=""
        primaryCta={{ label: "Back to Home", href: "/" }}
        secondaryCta={{ label: "Contact Support", href: "/contact" }}
      />

      <section className="w-full border-y border-black/10 bg-black/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-6 md:grid-cols-2 md:items-center">
            <div className="rounded-xs border border-black/10 bg-white p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Create new password
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-black">
              Reset your password
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Use a strong password you’ll remember. It must follow the same rule
              as registration.
            </p>

            {checkingLink ? (
              <div className="mt-6 rounded-xs border border-black/10 bg-black/[0.03] px-4 py-3 text-[13px] text-black/70">
                Verifying reset link...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[13px] font-semibold text-black/85"
                  >
                    New password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        if (error) setError("");
                        if (message) setMessage("");
                        setPassword(e.target.value);
                      }}
                      placeholder="Create a password"
                      className={`
                        w-full rounded-xs border bg-black/[0.03]
                        px-4 py-3 pr-12 text-[13px] text-black placeholder:text-black/35
                        outline-none transition
                        ${
                          password && password.length < 8
                            ? "border-red-500/60 focus:border-red-500/70"
                            : "border-black/10 focus:border-[#CE0028]/40"
                        }
                        focus:bg-black/[0.045]
                      `}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xs p-2 text-black/60 transition hover:bg-black/5 hover:text-black"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {password && password.length < 8 ? (
                    <p className="mt-1 text-[12px] text-red-600">
                      Password must be at least 8 characters.
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-[13px] font-semibold text-black/85"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showCnfmPwd ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        if (error) setError("");
                        if (message) setMessage("");
                        setConfirmPassword(e.target.value);
                      }}
                      placeholder="Confirm password"
                      className={`
                        w-full rounded-xs border bg-black/[0.03]
                        px-4 py-3 pr-12 text-[13px] text-black placeholder:text-black/35
                        outline-none transition
                        ${
                          passwordMismatch
                            ? "border-red-500/60 focus:border-red-500/70"
                            : "border-black/10 focus:border-[#CE0028]/40"
                        }
                        focus:bg-black/[0.045]
                      `}
                    />

                    <button
                      type="button"
                      onClick={() => setShowCnfmPwd(!showCnfmPwd)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xs p-2 text-black/60 transition hover:bg-black/5 hover:text-black"
                      aria-label={showCnfmPwd ? "Hide password" : "Show password"}
                    >
                      {showCnfmPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {passwordMismatch ? (
                    <p className="mt-1 text-[12px] text-red-600">
                      Passwords do not match.
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
                  disabled={
                    loading ||
                    !password ||
                    !confirmPassword ||
                    password.length < 8 ||
                    passwordMismatch ||
                    !accessToken ||
                    !refreshToken
                  }
                  className={`
                    w-full rounded-xs py-3 text-[13px] font-semibold text-white
                    shadow-[0_18px_60px_rgba(0,0,0,0.10)]
                    ${
                      loading ||
                      !password ||
                      !confirmPassword ||
                      password.length < 8 ||
                      passwordMismatch ||
                      !accessToken ||
                      !refreshToken
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }
                  `}
                  style={{ background: "black" }}
                >
                  {loading ? "Updating..." : "Update password"}
                </button>

                <div className="pt-1 text-sm text-black/60">
                  Back to account?{" "}
                  <Link
                    href="/"
                    className="font-semibold underline underline-offset-4"
                    style={{ color: BRAND_RED }}
                  >
                    Go to login
                  </Link>
                </div>
              </form>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-black/45">
              Reset access
            </p>

            <h2 className="mt-3 text-3xl font-semibold leading-tight text-black md:text-4xl">
              New password,{" "}
              <span style={{ color: BRAND_RED }}>same clean flow.</span>
            </h2>

            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-black/70 md:text-[15px]">
              <li className="flex gap-3">
                <Dot />
                Open the reset link sent to your email inbox.
              </li>
              <li className="flex gap-3">
                <Dot />
                Enter your new password and confirm it carefully.
              </li>
              <li className="flex gap-3">
                <Dot />
                Your password must be at least 8 characters.
              </li>
              <li className="flex gap-3">
                <Dot />
                Once updated, return to login and access your account.
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
                Need support
              </Link>
            </div>
          </div>

          
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard
            title="Password Match"
            desc="Your confirmation password must exactly match the new password you enter."
          />
          <InfoCard
            title="Expired Link"
            desc="If the reset link has expired, request a new one from the forgot password page."
          />
          <InfoCard
            title="Secure Access"
            desc="For safety, only valid recovery links can update your account password."
          />
          <InfoCard
            title="Need Help?"
            desc="If the reset process is not working, reach out to BLTDIF support for assistance."
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