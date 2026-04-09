import ProfileForm from "@/app/components/account/ProfileForm";
import PageHero from "@/app/components/marketing/PageHero";

export default function ProfilePage() {
  return (
    <main className="bg-white">
        <PageHero
            kicker="BLTDIF · ACCOUNT"
            title="ACCOUNT"
            subtitle="Fast dispatch, reliable delivery, and clear timelines — so you always know what to expect."
            //image="/images/shipping-hero.jpg"
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
            My Profile
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/60 md:text-[15px]">
            Save and manage your personal and shipping details in one place for
            a smoother BLTDIF checkout experience.
          </p>
        </div>

        <ProfileForm />
      </section>
    </main>
  );
}