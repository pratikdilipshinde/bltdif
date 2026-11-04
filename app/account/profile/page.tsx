
import Link from "next/link";
import ProfileForm from "@/app/components/account/ProfileForm";
import type { Metadata } from "next";
import AnnouncementBar from "@/app/components/AnnouncementBar";

export const metadata: Metadata = {
  title: "My Profile | BLTDIF",
  robots: {
    index: false,
    follow: false,
  },
};

const BRAND_RED = "#CE0028";

export default function ProfilePage() {
  return (
    <>
    <AnnouncementBar />
    
    <main className="relative min-h-screen overflow-hidden bg-[#f3f2ef] text-black">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full blur-[110px]"
          style={{ background: "rgba(206,0,40,0.07)" }}
        />
        <div className="absolute -right-40 top-[420px] h-[500px] w-[500px] rounded-full bg-white/80 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-white/70 blur-[110px]" />
      </div>

      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 md:px-6 md:pt-25">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
          <Link
            href="/"
            className="transition hover:text-black"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-black/65">My Account</span>
        </div>

        {/* Page introduction */}
        <div className="mb-4 flex flex-col gap-7 md:mb-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.32em]"
              style={{ color: BRAND_RED }}
            >
              BLTDIF · ACCOUNT
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-black md:text-6xl">
              My Profile<span style={{ color: BRAND_RED }}>.</span>
            </h1>

            <p className="mt-5 text-sm leading-7 text-black/55 md:text-base">
              Your details, your account, all in one place. Keep your personal
              and shipping information updated for a smoother BLTDIF
              experience.
            </p>
          </div>

          {/* <Link
            href="/products"
            className="group inline-flex h-12 w-fit items-center justify-center gap-3 rounded-full border border-black/10 bg-white/65 px-6 text-[11px] font-semibold uppercase tracking-[0.13em] text-black shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-black/20 hover:bg-white"
          >
            Explore Collection
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link> */}
        </div>

        {/* Profile form */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-2 rounded-[34px] bg-white/50 blur-2xl" />

          <div className="relative">
            <ProfileForm />
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-7 flex flex-col gap-3 border-t border-black/[0.07] pt-6 text-[11px] leading-6 text-black/40 sm:flex-row sm:items-center sm:justify-between">
          <p>BLTDIF · Made to stand apart.</p>
          <Link
            href="/contact"
            className="font-semibold text-black/55 transition hover:text-[#CE0028]"
          >
            Need help with your account? Contact support →
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}
