"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Filters, Product, CategoryKey } from "../../lib/shop/types";

function uniq(arr: string[]) {
  return Array.from(new Set(arr)).sort();
}
function toggle<T>(arr: T[], item: T) {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export default function FilterModal({
  open,
  onClose,
  categoryKey,
  products,
  base,
  value,
  onChange,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  categoryKey: CategoryKey;
  products: Product[];
  base: Filters;
  value: Filters;
  onChange: (v: Filters) => void;
  onReset: () => void;
}) {
  const availOptions = uniq(products.map((p) => p.availability));
  const sizeOptions = uniq(products.flatMap((p) => p.sizes ?? []));
  const fitOptions = uniq(products.flatMap((p) => (p.fit ? [p.fit] : [])));
  const colorOptions = uniq(products.flatMap((p) => p.colors ?? []));

  const showSizes = sizeOptions.length > 0;
  const showFits = fitOptions.length > 0;
  const showColors = colorOptions.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-[92vw] max-w-md bg-white shadow-2xl"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <div>
                <p className="text-xs tracking-[0.28em] uppercase text-black/50">Filters</p>
                <p className="text-sm font-semibold text-black">
                  Refine {categoryKey.toUpperCase()}
                </p>
              </div>

              <button onClick={onClose} className="rounded-xs cursor-pointer p-2 hover:bg-black/5" aria-label="Close filters">
                <X className="h-5 w-5 text-black/80" />
              </button>
            </div>

            <div className="h-[calc(100%-132px)] overflow-y-auto px-5 py-5">
              {/* Availability */}
              <Section title="Availability">
                {availOptions.map((a) => (
                  <CheckRow
                    key={a}
                    label={a}
                    checked={value.availability.includes(a as any)}
                    onClick={() =>
                      onChange({
                        ...value,
                        availability: toggle(value.availability, a as any),
                      })
                    }
                  />
                ))}
              </Section>

              {/* Price */}
              <Section title="Price">
                <div className="flex items-center justify-between text-sm text-black/70">
                  <span>${value.priceMin}</span>
                  <span>${value.priceMax}</span>
                </div>

                <div className="mt-3 grid gap-3">
                  <div>
                    <p className="text-xs text-black/50">Min</p>
                    <input
                      type="range"
                      min={base.priceMin}
                      max={base.priceMax}
                      value={value.priceMin}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          priceMin: Math.min(Number(e.target.value), value.priceMax),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-black/50">Max</p>
                    <input
                      type="range"
                      min={base.priceMin}
                      max={base.priceMax}
                      value={value.priceMax}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          priceMax: Math.max(Number(e.target.value), value.priceMin),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </Section>

              {/* Sizes */}
              {showSizes && (
                <Section title="Size">
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((s) => {
                      const active = value.sizes.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => onChange({ ...value, sizes: toggle(value.sizes, s) })}
                          className={`rounded-xs border px-3 py-1 text-sm transition ${
                            active
                              ? "border-black bg-black text-white"
                              : "border-black/15 bg-white text-black hover:border-black/30"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Fit */}
              {showFits && (
                <Section title="Fit">
                  <div className="flex flex-wrap gap-2">
                    {fitOptions.map((f) => {
                      const active = value.fits.includes(f as any);
                      return (
                        <button
                          key={f}
                          onClick={() => onChange({ ...value, fits: toggle(value.fits, f as any) })}
                          className={`rounded-xs border px-3 py-1 text-sm transition ${
                            active
                              ? "border-black bg-black text-white"
                              : "border-black/15 bg-white text-black hover:border-black/30"
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Color */}
              {showColors && (
                <Section title="Color">
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((c) => {
                      const active = value.colors.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => onChange({ ...value, colors: toggle(value.colors, c) })}
                          className={`rounded-xs border px-3 py-1 text-sm transition ${
                            active
                              ? "border-black bg-black text-white"
                              : "border-black/15 bg-white text-black hover:border-black/30"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-black/10 px-5 py-4">
              <button onClick={onReset} className="text-sm font-semibold text-black/60 hover:text-black">
                Reset
              </button>

              <button
                onClick={onClose}
                className="rounded-xs bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#111]"
              >
                Apply
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-xs tracking-[0.24em] uppercase text-black/45">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-between rounded-xs px-4 py-3 text-sm hover:bg-black/5"
    >
      <span className="text-black">{label}</span>
      <span className={`h-3 w-3 rounded-full border ${checked ? "border-black bg-black" : "border-black/20 bg-white"}`} />
    </button>
  );
}
