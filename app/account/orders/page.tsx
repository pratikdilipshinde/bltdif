
import MyOrdersClient from "@/app/components/account/MyOrdersClient";
import AnnouncementBar from "@/app/components/AnnouncementBar";

export const metadata = {
  title: "My Orders · BLTDIF",
  description:
    "Track your BLTDIF orders, review past purchases, and check shipping progress.",
};

export default function MyOrdersPage() {
  return (
    <>
    <AnnouncementBar />
    <main className="relative min-h-screen overflow-hidden bg-[#f3f2ef]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-white/90 blur-[120px]" />

        <div className="absolute -right-40 top-[25rem] h-[30rem] w-[30rem] rounded-full bg-[#CE0028]/[0.045] blur-[130px]" />

        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-white/80 blur-[120px]" />
      </div>

      <section className="relative z-10 px-4 py-10 md:px-6 md:py-14 pt-20 md:pt-25">
        <div className="mx-auto max-w-6xl">

          {/* PAGE INTRO */}
          <div className="mb-9 md:mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#CE0028] md:text-xs">
              BLTDIF · ACCOUNT
            </p>

            <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-black md:text-5xl">
                  My Orders
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/55 md:text-[15px]">
                  Your BLTDIF purchases, all in one place. Track shipments,
                  review your order history, and stay updated on every delivery.
                </p>
              </div>

              {/* <a
                href="/products"
                className="inline-flex w-fit items-center justify-center rounded-full border border-white/80 bg-white/45 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_15px_rgba(0,0,0,0.035)] backdrop-blur-xl transition-all duration-300 hover:border-black/15 hover:bg-black hover:text-white"
              >
                Continue Shopping
              </a> */}
            </div>
          </div>

          {/* ORDERS */}
          <MyOrdersClient />

        </div>
      </section>
    </main>
    </>
  );
}
