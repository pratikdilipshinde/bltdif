import ProductCard from "./ProductCard";
import { products } from "../data/products";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function ProductGrid({ title, subtitle }: Props) {
  return (
    <section
      id="collections"
      className="mx-auto max-w-6xl px-4 pb-14 pt-4 lg:px-0 lg:pb-20"
    >
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white md:text-xl">
            {title ?? "Featured pieces"}
          </h2>
          <p className="text-xs text-neutral-500 md:text-sm">
            {subtitle ??
              "Curated fits from the first BLTDIF drop. Built for late sessions."}
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
          Limited · No guaranteed restocks
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
