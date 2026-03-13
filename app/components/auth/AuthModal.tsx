"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Eye, EyeOff, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

type Mode = "login" | "register";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultMode?: Mode;
};

const BRAND_RED = "#CE0028";
const AUTH_IMAGE = "/images/Login-img.jpg";

const swapVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 28 : -28,
    opacity: 0,
    filter: "blur(10px)",
  }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({
    x: dir > 0 ? -28 : 28,
    opacity: 0,
    filter: "blur(10px)",
  }),
};

function getErrorMessage(payload: any) {
  if (!payload) return "Something went wrong.";
  if (typeof payload === "string") return payload;
  if (payload.error && typeof payload.error === "string") return payload.error;
  if (payload.message && typeof payload.message === "string") return payload.message;
  return "Something went wrong.";
}

export default function AuthModal({ open, onClose, defaultMode = "login" }: Props) {
  const router = useRouter();
  const { refresh } = useAuth();

  const [mode, setMode] = useState<Mode>(defaultMode);
  const [dir, setDir] = useState(1);

  const [showPwd, setShowPwd] = useState(false);
  const [showCnfmPwd, setShowCnfmPwd] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isRegister = mode === "register";

  const passwordMismatch =
    isRegister && confirmPassword.length > 0 && password !== confirmPassword;

  const emailInvalid = useMemo(() => {
    if (!email) return false;
    return !/^\S+@\S+\.\S+$/.test(email);
  }, [email]);

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (!email || !password) return false;
    if (emailInvalid) return false;

    if (isRegister) {
      if (password.length < 8) return false;
      if (!confirmPassword) return false;
      if (passwordMismatch) return false;
    }
    return true;
  }, [loading, email, password, emailInvalid, isRegister, confirmPassword, passwordMismatch]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const resetFields = () => {
    setShowPwd(false);
    setShowCnfmPwd(false);

    setFirstname("");
    setLastname("");
    setEmail("");

    setPassword("");
    setConfirmPassword("");

    setFormError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setDir(1);
      resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultMode]);

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setDir(next === "register" ? 1 : -1);
    setMode(next);
    resetFields();
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!canSubmit) return;

    try {
      setLoading(true);

      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

      const payload = isRegister
        ? {
            firstname: firstname.trim() || null,
            lastname: lastname.trim() || null,
            email: email.trim(),
            password,
          }
        : {
            email: email.trim(),
            password,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setFormError(getErrorMessage(data));
        setLoading(false);
        return;
      }

      // ✅ update navbar instantly
      await refresh();

      setLoading(false);
      onClose();
      router.refresh();
    } catch {
      setLoading(false);
      setFormError("Network error. Please try again.");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.button
            aria-label="Close modal overlay"
            className="fixed inset-0 z-[90] cursor-default bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Center wrapper */}
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center p-3 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 16, opacity: 0, scale: 0.99 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="
                relative w-full max-w-5xl
                rounded-xs bg-white
                border border-black/10
                shadow-[0_30px_90px_rgba(0,0,0,0.20)]
                overflow-hidden
                h-[min(78vh,600px)] md:h-[min(90vh,600px)]
              "
            >
              {/* Close button */}
              <button
                aria-label="Close"
                onClick={onClose}
                className="absolute right-3 top-3 z-20 rounded-xs p-2 hover:bg-black/5 transition"
              >
                <X className="h-5 w-5 text-black/45" />
              </button>

              {/* Body */}
              <div className="grid h-full grid-cols-1 md:grid-cols-2">
                {/* Content side */}
                <div
                  className={`
                    ${isRegister ? "md:order-2" : "md:order-1"}
                    h-full px-5 py-5 md:px-8 md:py-6
                    flex flex-col overflow-y-auto
                  `}
                >
                  <div className="flex items-center mx-auto gap-3">
                    <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: BRAND_RED }} />
                    <p className="text-[11px] font-semibold tracking-[0.26em] text-black/60">
                      BLTDIF · ACCOUNT
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 rounded-xs border border-black/10 bg-black/[0.03] p-1">
                    <Tab active={!isRegister} onClick={() => switchMode("login")}>
                      Login
                    </Tab>
                    <Tab active={isRegister} onClick={() => switchMode("register")}>
                      Register
                    </Tab>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <AnimatePresence mode="wait" custom={dir}>
                      <motion.div
                        key={mode}
                        custom={dir}
                        variants={swapVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-3"
                      >
                        <h2 className="text-[20px] md:text-[28px] font-semibold text-black leading-tight">
                          {isRegister ? "Create your account" : "Welcome back"}
                        </h2>

                        <p className="mt-1.5 text-[13px] text-black/60 leading-relaxed">
                          {isRegister
                            ? "Create an account to checkout faster."
                            : "Login to manage your cart and checkout faster."}
                        </p>

                        <form className="mt-4 space-y-2.5" onSubmit={onSubmit}>
                          {formError ? (
                            <div className="rounded-xs border border-red-500/25 bg-red-50 px-3 py-2 text-[13px] text-red-700">
                              {formError}
                            </div>
                          ) : null}

                          {isRegister && (
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                              <Field
                                label="First name"
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                              />
                              <Field
                                label="Last name"
                                placeholder="Last Name"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                              />
                            </div>
                          )}

                          <Field
                            label="Email"
                            placeholder="you@domain.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={emailInvalid ? "Please enter a valid email" : undefined}
                          />

                          {!isRegister ? (
                            <Field
                              label="Password"
                              placeholder="••••••••"
                              type={showPwd ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              right={
                                <button
                                  type="button"
                                  onClick={() => setShowPwd(!showPwd)}
                                  className="rounded-xs p-2 text-black/60 hover:bg-black/5 hover:text-black transition"
                                  aria-label={showPwd ? "Hide password" : "Show password"}
                                >
                                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              }
                            />
                          ) : (
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                              <Field
                                label="Password"
                                placeholder="Create a password"
                                type={showPwd ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={password && password.length < 8 ? "Min 8 characters" : undefined}
                                right={
                                  <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="rounded-xs p-2 text-black/60 hover:bg-black/5 hover:text-black transition"
                                    aria-label={showPwd ? "Hide password" : "Show password"}
                                  >
                                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                }
                              />

                              <Field
                                label="Confirm password"
                                placeholder="Confirm password"
                                type={showCnfmPwd ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={passwordMismatch ? "Passwords do not match" : undefined}
                                right={
                                  <button
                                    type="button"
                                    onClick={() => setShowCnfmPwd(!showCnfmPwd)}
                                    className="rounded-xs p-2 text-black/60 hover:bg-black/5 hover:text-black transition"
                                    aria-label={showCnfmPwd ? "Hide password" : "Show password"}
                                  >
                                    {showCnfmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                }
                              />
                            </div>
                          )}

                          {!isRegister ? (
                            <div className="flex items-center justify-between pt-0.5">
                              <label className="flex items-center gap-2 text-[13px] text-black/60">
                                <input type="checkbox" className="h-4 w-4 accent-[#CE0028]" />
                                Remember me
                              </label>
                              <button
                                type="button"
                                className="text-[13px] text-black/60 hover:text-black transition"
                                onClick={() => setFormError("Forgot password not wired yet.")}
                              >
                                Forgot password?
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-start gap-2 text-[13px] text-black/60 pt-0.5">
                              <input type="checkbox" className="mt-1 h-4 w-4 accent-[#CE0028]" required />
                              <span className="leading-relaxed">
                                I agree to the <span className="text-black underline underline-offset-4">Terms</span> and{" "}
                                <span className="text-black underline underline-offset-4">Privacy Policy</span>.
                              </span>
                            </label>
                          )}

                          <PrimaryButton
                            label={
                              loading
                                ? isRegister
                                  ? "Creating..."
                                  : "Logging in..."
                                : isRegister
                                ? "Create account"
                                : "Login"
                            }
                            disabled={!canSubmit}
                          />

                          <Divider />

                          <SecondaryButton label="Continue with Google" />

                          <p className="pt-0.5 text-center text-[13px] text-black/60">
                            {isRegister ? "Already have an account?" : "New here?"}{" "}
                            <button
                              type="button"
                              onClick={() => switchMode(isRegister ? "login" : "register")}
                              className="font-semibold underline underline-offset-4"
                              style={{ color: BRAND_RED }}
                              disabled={loading}
                            >
                              {isRegister ? "Login" : "Create account"}
                            </button>
                          </p>
                        </form>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Image side */}
                <div
                  className={`
                    ${isRegister ? "md:order-1" : "md:order-2"}
                    hidden md:block relative h-full overflow-hidden
                  `}
                >
                  <AnimatePresence mode="popLayout" custom={dir}>
                    <motion.div
                      key={mode + "-image"}
                      custom={dir}
                      variants={swapVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.15, ease: [0.15, 1, 0.25, 1] }}
                      className="absolute inset-0"
                    >
                      <Image src={AUTH_IMAGE} alt="BLTDIF" fill className="object-cover" priority />

                      <div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(135deg, rgba(0,0,0,0.08), rgba(206,0,40,0.08))",
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------- Small UI ----------------------------- */

function Tab({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative rounded-xs py-2 text-[13px] font-semibold cursor-pointer">
      {active && (
        <motion.div
          layoutId="authTabRect"
          className="absolute inset-0 rounded-xs"
          style={{ background: `black` }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        />
      )}
      <span className={`relative z-10 ${active ? "text-white" : "text-black/70"}`}>{children}</span>
    </button>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  right,
  value,
  onChange,
  error,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  right?: React.ReactNode;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-semibold text-black/85">{label}</label>

      <div className="relative">
        <input
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full rounded-xs border bg-black/[0.03]
            px-4 py-2.5 pr-12 text-[13px] text-black placeholder:text-black/35
            outline-none transition
            ${error ? "border-red-500/60 focus:border-red-500/70" : "border-black/10 focus:border-[#CE0028]/40"}
            focus:bg-black/[0.045]
          `}
        />
        {right ? <div className="absolute right-2 top-1/2 -translate-y-1/2">{right}</div> : null}
      </div>

      {error ? <p className="mt-1 text-[12px] text-red-600">{error}</p> : null}
    </div>
  );
}

function PrimaryButton({ label, disabled }: { label: string; disabled?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ y: disabled ? 0 : -1 }}
      type="submit"
      disabled={disabled}
      className={`
        w-full rounded-xs py-2.5 text-[13px] font-semibold text-white
        drop-shadow-md
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
      style={{ background: `black` }}
    >
      {label}
    </motion.button>
  );
}

function SecondaryButton({ label }: { label: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      type="button"
      className="w-full rounded-xs border border-black/10 bg-white py-2.5 text-[13px] font-semibold text-black hover:bg-black/[0.02] transition"
      onClick={() => alert("Google auth not wired yet.")}
    >
      {label}
    </motion.button>
  );
}

function Divider() {
  return (
    <div className="relative py-1.5">
      <div className="h-px w-full bg-black/10" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] tracking-[0.24em] text-black/55">
        OR
      </span>
    </div>
  );
}
