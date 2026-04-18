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
const AUTH_IMAGE = "/images/logged-in-img.jpg";

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

function getErrorMessage(payload: any, isRegister: boolean) {
  if (!payload) {
    return "Something went wrong. Please try again.";
  }

  const raw =
    typeof payload === "string"
      ? payload
      : payload.error || payload.message || payload.msg || "";

  if (!raw || typeof raw !== "string") {
    return "Something went wrong. Please try again.";
  }

  const msg = raw.toLowerCase();

  if (msg.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  if (msg.includes("email not confirmed")) {
    return "Please verify your email before logging in.";
  }

  if (msg.includes("user already registered") || msg.includes("already exists")) {
    return "An account with this email already exists. Please login instead.";
  }

  if (msg.includes("password should be at least")) {
    return "Password must be at least 8 characters.";
  }

  if (
    msg.includes("unable to validate email address") ||
    msg.includes("invalid email")
  ) {
    return "Please enter a valid email address.";
  }

  if (msg.includes("network")) {
    return "Network issue detected. Please try again.";
  }

  return isRegister
    ? "Unable to create your account right now. Please try again."
    : "Unable to log you in right now. Please try again.";
}

export default function AuthModal({
  open,
  onClose,
  defaultMode = "register",
}: Props) {
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      if (!firstname.trim() || !lastname.trim()) return false;
      if (password.length < 8) return false;
      if (!confirmPassword) return false;
      if (passwordMismatch) return false;
    }

    return true;
  }, [
    loading,
    email,
    password,
    emailInvalid,
    isRegister,
    firstname,
    lastname,
    confirmPassword,
    passwordMismatch,
  ]);

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
    setSuccessMessage(null);
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

  const clearErrorOnChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (formError) setFormError(null);
      if (successMessage) setSuccessMessage(null);
      setter(e.target.value);
    };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedFirst = firstname.trim();
    const trimmedLast = lastname.trim();

    if (!trimmedEmail) {
      setFormError("Email is required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setFormError("Password is required.");
      return;
    }

    if (isRegister) {
      if (!trimmedFirst) {
        setFormError("First name is required.");
        return;
      }

      if (!trimmedLast) {
        setFormError("Last name is required.");
        return;
      }

      if (password.length < 8) {
        setFormError("Password must be at least 8 characters.");
        return;
      }

      if (!confirmPassword) {
        setFormError("Please confirm your password.");
        return;
      }

      if (password !== confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

      const payload = isRegister
        ? {
            firstname: trimmedFirst,
            lastname: trimmedLast,
            email: trimmedEmail,
            password,
          }
        : {
            email: trimmedEmail,
            password,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        setFormError(getErrorMessage(data, isRegister));
        return;
      }

      if (isRegister) {
        setSuccessMessage(
          "Account created successfully. Please check your email to verify your account."
        );
        setPassword("");
        setConfirmPassword("");
        return;
      }

      await refresh();
      resetFields();
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Auth submit error:", error);
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close modal overlay"
            className="fixed inset-0 z-[90] cursor-default bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center p-3 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
              <button
                aria-label="Close"
                onClick={onClose}
                className="absolute right-3 top-3 z-20 rounded-xs p-2 transition hover:bg-black/5"
              >
                <X className="h-5 w-5 text-black/45" />
              </button>

              <div className="grid h-full grid-cols-1 md:grid-cols-2">
                <div
                  className={`
                    ${isRegister ? "md:order-2" : "md:order-1"}
                    h-full px-5 py-5 md:px-8 md:py-6
                    flex flex-col overflow-y-auto
                  `}
                >
                  <div className="mx-auto flex items-center gap-3">
                    <span
                      className="inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: BRAND_RED }}
                    />
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

                  <div className="flex flex-1 flex-col">
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
                        <h2 className="leading-tight text-[20px] font-semibold text-black md:text-[28px]">
                          {isRegister ? "Create your account" : "Welcome back"}
                        </h2>

                        <p className="mt-1.5 text-[13px] leading-relaxed text-black/60">
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

                          {successMessage ? (
                            <div className="rounded-xs border border-green-500/25 bg-green-50 px-3 py-2 text-[13px] text-green-700">
                              {successMessage}
                            </div>
                          ) : null}

                          {isRegister && (
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                              <Field
                                label="First name"
                                placeholder="First Name"
                                value={firstname}
                                onChange={clearErrorOnChange(setFirstname)}
                              />
                              <Field
                                label="Last name"
                                placeholder="Last Name"
                                value={lastname}
                                onChange={clearErrorOnChange(setLastname)}
                              />
                            </div>
                          )}

                          <Field
                            label="Email"
                            placeholder="you@domain.com"
                            type="email"
                            value={email}
                            onChange={clearErrorOnChange(setEmail)}
                            error={emailInvalid ? "Please enter a valid email" : undefined}
                          />

                          {!isRegister ? (
                            <Field
                              label="Password"
                              placeholder="••••••••"
                              type={showPwd ? "text" : "password"}
                              value={password}
                              onChange={clearErrorOnChange(setPassword)}
                              right={
                                <button
                                  type="button"
                                  onClick={() => setShowPwd(!showPwd)}
                                  className="rounded-xs p-2 text-black/60 transition hover:bg-black/5 hover:text-black"
                                  aria-label={showPwd ? "Hide password" : "Show password"}
                                >
                                  {showPwd ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
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
                                onChange={clearErrorOnChange(setPassword)}
                                error={
                                  password && password.length < 8
                                    ? "Min 8 characters"
                                    : undefined
                                }
                                right={
                                  <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="rounded-xs p-2 text-black/60 transition hover:bg-black/5 hover:text-black"
                                    aria-label={showPwd ? "Hide password" : "Show password"}
                                  >
                                    {showPwd ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                }
                              />

                              <Field
                                label="Confirm password"
                                placeholder="Confirm password"
                                type={showCnfmPwd ? "text" : "password"}
                                value={confirmPassword}
                                onChange={clearErrorOnChange(setConfirmPassword)}
                                error={
                                  passwordMismatch ? "Passwords do not match" : undefined
                                }
                                right={
                                  <button
                                    type="button"
                                    onClick={() => setShowCnfmPwd(!showCnfmPwd)}
                                    className="rounded-xs p-2 text-black/60 transition hover:bg-black/5 hover:text-black"
                                    aria-label={
                                      showCnfmPwd ? "Hide password" : "Show password"
                                    }
                                  >
                                    {showCnfmPwd ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                }
                              />
                            </div>
                          )}

                          {!isRegister ? (
                            <div className="flex items-center justify-between pt-0.5">
                              <label className="flex items-center gap-2 text-[13px] text-black/60">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 accent-[#CE0028]"
                                />
                                Remember me
                              </label>

                              <button
                                type="button"
                                className="text-[13px] text-black/60 transition hover:text-black"
                                onClick={() => {
                                  resetFields();
                                  onClose();
                                  router.push("/forgot-password");
                                }}
                              >
                                Forgot password?
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-start gap-2 pt-0.5 text-[13px] text-black/60">
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 accent-[#CE0028]"
                                required
                              />
                              <span className="leading-relaxed">
                                I agree to the{" "}
                                <span className="text-black underline underline-offset-4">
                                  Terms
                                </span>{" "}
                                and{" "}
                                <span className="text-black underline underline-offset-4">
                                  Privacy Policy
                                </span>
                                .
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

                          {/* <SecondaryButton label="Continue with Google" /> */}

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

                <div
                  className={`
                    ${isRegister ? "md:order-1" : "md:order-2"}
                    relative hidden h-full overflow-hidden md:block
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
                      <Image
                        src={AUTH_IMAGE}
                        alt="BLTDIF"
                        fill
                        className="object-cover"
                        priority
                      />

                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(0,0,0,0.08), rgba(206,0,40,0.08))",
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

function Tab({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative cursor-pointer rounded-xs py-2 text-[13px] font-semibold"
    >
      {active && (
        <motion.div
          layoutId="authTabRect"
          className="absolute inset-0 rounded-xs"
          style={{ background: "black" }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        />
      )}
      <span className={`relative z-10 ${active ? "text-white" : "text-black/70"}`}>
        {children}
      </span>
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
      <label className="mb-1 block text-[13px] font-semibold text-black/85">
        {label}
      </label>

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
            ${
              error
                ? "border-red-500/60 focus:border-red-500/70"
                : "border-black/10 focus:border-[#CE0028]/40"
            }
            focus:bg-black/[0.045]
          `}
        />
        {right ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{right}</div>
        ) : null}
      </div>

      {error ? <p className="mt-1 text-[12px] text-red-600">{error}</p> : null}
    </div>
  );
}

function PrimaryButton({
  label,
  disabled,
}: {
  label: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ y: disabled ? 0 : -1 }}
      type="submit"
      disabled={disabled}
      className={`
        w-full rounded-xs py-2.5 text-[13px] font-semibold text-white
        drop-shadow-md
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
      `}
      style={{ background: "black" }}
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
      className="w-full rounded-xs border border-black/10 bg-white py-2.5 text-[13px] font-semibold text-black transition hover:bg-black/[0.02]"
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