"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!password || password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setMessage("Password updated successfully. Redirecting to login...");
      setLoading(false);

      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch {
      setLoading(false);
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="min-h-screen bg-white px-4 py-20">
      <div className="mx-auto w-full max-w-md rounded-xs border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-[28px] font-semibold text-black">
          Set new password
        </h1>

        <p className="mt-2 text-[14px] text-black/60">
          Enter your new password below.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-[13px] font-semibold text-black/85">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-xs border border-black/10 bg-black/[0.03] px-4 py-2.5 text-[13px] text-black outline-none focus:border-[#CE0028]/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-semibold text-black/85">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={`w-full rounded-xs border bg-black/[0.03] px-4 py-2.5 text-[13px] text-black outline-none ${
                passwordMismatch
                  ? "border-red-500/60"
                  : "border-black/10 focus:border-[#CE0028]/40"
              }`}
            />
          </div>

          {message ? (
            <div className="rounded-xs border border-black/10 bg-black/[0.03] px-3 py-2 text-[13px] text-black/75">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xs bg-black py-2.5 text-[13px] font-semibold text-white ${
              loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </section>
  );
}