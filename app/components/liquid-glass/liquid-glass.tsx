"use client";

import {
  forwardRef,
  useEffect,
  useId,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

/* ==========================================
   SHARED UTILITIES
   ========================================== */

export function cn(
  ...classes: Array<string | false | null | undefined>
) {
  return classes.filter(Boolean).join(" ");
}

export const liquidGlassButtonClass = (
  className?: string
) =>
  cn(
    "liquid-glass-button liquid-glass-shimmer",
    className
  );

/* ==========================================
   BUTTON
   ========================================== */

type LiquidGlassButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "brand" | "rounded";
  };

export const LiquidGlassButton = forwardRef<
  HTMLButtonElement,
  LiquidGlassButtonProps
>(function LiquidGlassButton(
  {
    variant = "default",
    className,
    type = "button",
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        liquidGlassButtonClass(),
        "min-h-11 px-6 py-3 text-sm font-semibold",
        variant === "brand" &&
          "liquid-glass-button--brand",
        variant === "rounded" &&
          "liquid-glass-button--rounded",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

/* ==========================================
   ICON BUTTON
   ========================================== */

type LiquidGlassIconButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    size?: "sm" | "md" | "lg";
  };

export const LiquidGlassIconButton = forwardRef<
  HTMLButtonElement,
  LiquidGlassIconButtonProps
>(function LiquidGlassIconButton(
  {
    label,
    size = "md",
    className,
    children,
    type = "button",
    ...props
  },
  ref
) {
  const sizeClass = {
    sm: "h-9 w-9",
    md: "h-11 w-11",
    lg: "h-12 w-12",
  }[size];

  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        liquidGlassButtonClass(),
        sizeClass,
        "shrink-0 rounded-full p-0",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

/* ==========================================
   CARD
   ========================================== */

type LiquidGlassCardProps =
  HTMLAttributes<HTMLDivElement> & {
    hover?: boolean;
  };

export const LiquidGlassCard = forwardRef<
  HTMLDivElement,
  LiquidGlassCardProps
>(function LiquidGlassCard(
  { hover = false, className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "liquid-glass liquid-glass-card",
        hover && "liquid-glass-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

/* ==========================================
   PANEL
   ========================================== */

type LiquidGlassPanelProps =
  HTMLAttributes<HTMLDivElement>;

export const LiquidGlassPanel = forwardRef<
  HTMLDivElement,
  LiquidGlassPanelProps
>(function LiquidGlassPanel(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "liquid-glass liquid-glass-panel",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

/* ==========================================
   NAVBAR SURFACE
   ========================================== */

type LiquidGlassNavbarProps =
  HTMLAttributes<HTMLElement>;

export const LiquidGlassNavbar = forwardRef<
  HTMLElement,
  LiquidGlassNavbarProps
>(function LiquidGlassNavbar(
  { className, children, ...props },
  ref
) {
  return (
    <nav
      ref={ref}
      className={cn(
        "liquid-glass liquid-glass-navbar",
        className
      )}
      {...props}
    >
      {children}
    </nav>
  );
});

/* ==========================================
   DROPDOWN SURFACE
   ========================================== */

type LiquidGlassDropdownProps =
  HTMLAttributes<HTMLDivElement>;

export const LiquidGlassDropdown = forwardRef<
  HTMLDivElement,
  LiquidGlassDropdownProps
>(function LiquidGlassDropdown(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "liquid-glass liquid-glass-dropdown",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

/* ==========================================
   INPUT
   ========================================== */

export const LiquidGlassInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function LiquidGlassInput(
  { className, type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn("liquid-glass-input", className)}
      {...props}
    />
  );
});

/* ==========================================
   SELECT
   ========================================== */

export const LiquidGlassSelect = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function LiquidGlassSelect(
  { className, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn("liquid-glass-select", className)}
      {...props}
    >
      {children}
    </select>
  );
});

/* ==========================================
   TEXTAREA
   ========================================== */

export const LiquidGlassTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function LiquidGlassTextarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "liquid-glass-textarea",
        className
      )}
      {...props}
    />
  );
});

/* ==========================================
   MODAL
   ========================================== */

type LiquidGlassModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  closeOnBackdrop?: boolean;
};

export function LiquidGlassModal({
  open,
  onClose,
  children,
  title,
  className,
  closeOnBackdrop = true,
}: LiquidGlassModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="liquid-glass-backdrop"
      onMouseDown={(event) => {
        if (
          closeOnBackdrop &&
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          "liquid-glass liquid-glass-modal",
          className
        )}
      >
        {title && (
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2
              id={titleId}
              className="text-lg font-semibold text-black"
            >
              {title}
            </h2>

            <LiquidGlassIconButton
              label="Close dialog"
              onClick={onClose}
              className="text-xl"
            >
              <span aria-hidden="true">×</span>
            </LiquidGlassIconButton>
          </div>
        )}

        {children}
      </section>
    </div>
  );
}