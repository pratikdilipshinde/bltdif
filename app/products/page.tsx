import ProductGrid from "../components/ProductGrid";

export default function ProductsPage() {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-6xl px-4 pt-10 lg:px-0">
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Shop all products
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Hoodies, tees, joggers, and accessories crafted for the ones who build
          different.
        </p>
      </div>
      <ProductGrid
        title="All products"
        subtitle="Mix and match your BLTDIF staples."
      />
    </div>
  );
}
