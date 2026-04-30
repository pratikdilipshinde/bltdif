import PageHero from "@/app/components/marketing/PageHero";
import MyOrdersClient from "@/app/components/account/MyOrdersClient";

export default function MyOrdersPage() {
  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · ACCOUNT"
        title="MY ORDERS"
        subtitle="Track your BLTDIF orders, review past purchases, and check shipping progress in one place."
        image=""
        primaryCta={{ label: "Shop Drop 01", href: "/products" }}
        secondaryCta={{ label: "Contact Support", href: "/contact" }}
      />

      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8 md:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
            BLTDIF · ACCOUNT
          </p>

          <h1 className="mt-3 text-3xl font-semibold leading-tight text-black md:text-5xl">
            My Orders
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/60 md:text-[15px]">
            View your order history, track current shipments, and check the
            status of every BLTDIF purchase linked to your account.
          </p>
        </div>

        <MyOrdersClient />
      </section>
    </main>
  );
}