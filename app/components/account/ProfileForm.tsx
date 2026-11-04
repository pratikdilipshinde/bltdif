
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  UserRound,
  MapPin,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const BRAND_RED = "#CE0028";

type ProfileData = {
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  currentAddress: string;
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

const initialState: ProfileData = {
  email: "",
  firstname: "",
  lastname: "",
  phoneNumber: "",
  currentAddress: "",
  shippingAddress: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

export default function ProfileForm() {
  const [form, setForm] = useState<ProfileData>(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const res = await fetch("/api/user-profile", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load profile");
        }

        if (active) {
          setForm({
            ...initialState,
            ...data.profile,
          });
        }
      } catch (error) {
        console.error(error);

        if (active) {
          toast.error("Could not load profile");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      const res = await fetch("/api/user-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: form.firstname,
          lastname: form.lastname,
          phoneNumber: form.phoneNumber,
          currentAddress: form.currentAddress,
          shippingAddress: form.shippingAddress,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save profile");
      }

      setForm({
        ...initialState,
        ...data.profile,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  const displayName =
    `${form.firstname} ${form.lastname}`.trim() || "BLTDIF Member";

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Compact profile overview */}
      <section className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white/75 shadow-[0_14px_45px_rgba(0,0,0,0.045)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#CE0028]/[0.08] blur-[70px]" />

        <div className="relative p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#CE0028] to-[#780018] text-white shadow-[0_9px_25px_rgba(206,0,40,0.22)]">
                <UserRound size={26} strokeWidth={1.6} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#CE0028]">
                  BLTDIF · ACCOUNT
                </p>

                <h2 className="mt-1 truncate text-xl font-semibold tracking-tight text-black md:text-2xl">
                  {displayName}
                  <span className="text-[#CE0028]">.</span>
                </h2>

                <p className="mt-1 text-[11px] text-black/45">
                  Manage your personal and delivery details.
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-green-700/10 bg-green-600/[0.07] px-3 py-2">
              <ShieldCheck size={14} className="text-green-700" />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-green-800">
                Account details
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 border-t border-black/[0.07] pt-4">
            <Mail size={15} className="shrink-0 text-black/35" />
            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-black/35">
                Registered email
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-black/75">
                {form.email || "Email not available"}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-black/[0.04] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider text-black/40">
              Read only
            </span>
          </div>
        </div>
      </section>

      {/* Personal information */}
      <section className="overflow-hidden rounded-[24px] border border-white/90 bg-white/75 shadow-[0_14px_45px_rgba(0,0,0,0.04)] backdrop-blur-2xl">
        <SectionHeader
          number="01"
          title="Personal Information"
          description="Your core account details."
          icon={<UserRound size={18} />}
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-4 p-5 md:grid-cols-2 md:p-6">
          <Field
            label="First name"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            placeholder="First name"
          />

          <Field
            label="Last name"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            placeholder="Last name"
          />

          <Field
            label="Email address"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled
            placeholder="Email address"
          />

          <Field
            label="Phone number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Phone number"
            icon={<Phone size={15} />}
          />
        </div>
      </section>

      {/* Address information */}
      <section className="overflow-hidden rounded-[24px] border border-white/90 bg-white/75 shadow-[0_14px_45px_rgba(0,0,0,0.04)] backdrop-blur-2xl">
        <SectionHeader
          number="02"
          title="Address Information"
          description="Your location and preferred delivery addresses."
          icon={<MapPin size={18} />}
        />

        <div className="space-y-5 p-5 md:p-6">
          <div>
            <Subheading>Location details</Subheading>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
              <Field
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
              />

              <Field
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
              />

              <Field
                label="Zip code"
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                placeholder="Postal code"
              />

              <Field
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>
          </div>

          <div className="h-px bg-black/[0.07]" />

          <div>
            <Subheading>Address details</Subheading>

            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextAreaField
                label="Current address"
                name="currentAddress"
                value={form.currentAddress}
                onChange={handleChange}
                placeholder="Enter current address"
              />

              <TextAreaField
                label="Shipping address"
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                placeholder="Enter shipping address"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Compact save bar */}
      <div className="flex flex-col gap-3 rounded-[22px] border border-white/90 bg-white/75 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-semibold text-black">
            Keep your profile up to date
          </p>
          <p className="mt-1 text-[10px] text-black/45">
            Your details help us deliver your orders smoothly.
          </p>
        </div>

        <SaveButton saving={saving} />
      </div>
    </form>
  );
}

/* Section header */

function SectionHeader({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-black/[0.06] bg-gradient-to-r from-white/90 to-[#f9e9ec]/30 px-5 py-4 md:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#CE0028]/[0.08] text-[#CE0028]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-bold tracking-wider text-[#CE0028]">
            {number}
          </span>
          <span className="h-1 w-1 rounded-full bg-black/20" />
          <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-black/35">
            BLTDIF PROFILE
          </span>
        </div>

        <h3 className="mt-0.5 text-base font-semibold tracking-tight text-black md:text-lg">
          {title}
        </h3>

        <p className="mt-0.5 text-[10px] text-black/45 md:text-xs">
          {description}
        </p>
      </div>

      <span className="hidden text-3xl font-light tracking-tight text-black/[0.07] sm:block">
        {number}
      </span>
    </div>
  );
}

/* Subheading */

function Subheading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-4 w-1 rounded-full bg-[#CE0028]" />
      <h4 className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/60">
        {children}
      </h4>
    </div>
  );
}

/* Input field */

function Field({
  label,
  name,
  value,
  onChange,
  disabled = false,
  placeholder = "",
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="group min-w-0">
      <label
        htmlFor={name}
        className="mb-2 block text-[9px] font-bold uppercase tracking-[0.15em] text-black/50"
      >
        {label}
        {disabled && (
          <span className="ml-1.5 font-medium normal-case tracking-normal text-black/30">
            (Read only)
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35 transition-colors group-focus-within:text-[#CE0028]">
            {icon}
          </span>
        )}

        <input
          id={name}
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border border-black/[0.07] bg-white/80 px-3.5 text-xs font-medium text-black shadow-[0_3px_12px_rgba(0,0,0,0.02)] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-black/25 hover:border-black/15 focus:border-[#CE0028]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,0,40,0.055)] disabled:cursor-not-allowed disabled:bg-black/[0.035] disabled:text-black/40 ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
}

/* Textarea */

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
}) {
  return (
    <div className="group min-w-0">
      <label
        htmlFor={name}
        className="mb-2 block text-[9px] font-bold uppercase tracking-[0.15em] text-black/50"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        placeholder={placeholder}
        className="min-h-[88px] w-full resize-y rounded-xl border border-black/[0.07] bg-white/80 px-3.5 py-3 text-xs leading-5 text-black shadow-[0_3px_12px_rgba(0,0,0,0.02)] outline-none transition-all duration-200 placeholder:text-black/25 hover:border-black/15 focus:border-[#CE0028]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,0,40,0.055)]"
      />
    </div>
  );
}

/* Save button */

function SaveButton({ saving }: { saving: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="group inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#CE0028] to-[#8B001C] px-6 text-[9px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_9px_25px_rgba(206,0,40,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_13px_30px_rgba(206,0,40,0.28)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      <Save size={14} />
      {saving ? "Saving..." : "Save Profile"}
      {!saving && (
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </button>
  );
}

/* Loading skeleton */

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-[24px] border border-white/90 bg-white/70 p-5 shadow-[0_14px_45px_rgba(0,0,0,0.035)] backdrop-blur-xl md:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-black/[0.07]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-28 rounded-full bg-black/[0.07]" />
              <div className="h-4 w-48 max-w-full rounded-full bg-black/[0.07]" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-11 rounded-xl bg-black/[0.045]" />
            <div className="h-11 rounded-xl bg-black/[0.045]" />
            <div className="h-11 rounded-xl bg-black/[0.045]" />
            <div className="h-11 rounded-xl bg-black/[0.045]" />
          </div>
        </div>
      ))}
    </div>
  );
}
