"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

        setForm(data.profile);
      } catch (error) {
        console.error(error);
        toast.error("Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/user-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

      setForm(data.profile);
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

  if (loading) {
    return (
      <div className="rounded-xs border border-black/10 bg-white p-5 md:p-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="h-3 w-28 animate-pulse rounded bg-black/10" />
            <div className="h-8 w-56 animate-pulse rounded bg-black/10" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded bg-black/10" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-14 animate-pulse rounded-xs bg-black/[0.04]" />
            <div className="h-14 animate-pulse rounded-xs bg-black/[0.04]" />
            <div className="h-14 animate-pulse rounded-xs bg-black/[0.04]" />
            <div className="h-14 animate-pulse rounded-xs bg-black/[0.04]" />
          </div>

          <div className="h-28 animate-pulse rounded-xs bg-black/[0.04]" />
          <div className="h-28 animate-pulse rounded-xs bg-black/[0.04]" />
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="overflow-hidden rounded-xs border border-black/10 bg-white"
    >
      {/* Top header */}
      <div className="border-b border-black/10 px-5 py-6 md:px-8 md:py-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Account Details
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-black md:text-3xl">
              Edit your profile
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/60">
              Keep your information current for faster checkout, smoother
              delivery, and better order support.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-xs px-6 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.10)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)`,
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="px-5 py-6 md:px-8 md:py-8">
        <div className="space-y-10">
          <SectionHeader
            eyebrow="01"
            title="Basic Information"
            description="Your core account details used across your BLTDIF profile."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="Email address"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled
              placeholder="Email address"
            />

            <div className="hidden md:block" />

            <Field
              label="First name"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              placeholder="Enter first name"
            />

            <Field
              label="Last name"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              placeholder="Enter last name"
            />

            <Field
              label="Phone number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="h-px w-full bg-black/10" />

          <SectionHeader
            eyebrow="02"
            title="Address Information"
            description="Use accurate address details to make shipping and delivery seamless."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter city"
            />

            <Field
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Enter state"
            />

            <Field
              label="Zip code"
              name="zipCode"
              value={form.zipCode}
              onChange={handleChange}
              placeholder="Enter zip code"
            />

            <Field
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Enter country"
            />

            <div className="md:col-span-2">
              <TextAreaField
                label="Current address"
                name="currentAddress"
                value={form.currentAddress}
                onChange={handleChange}
                placeholder="Enter current address"
              />
            </div>

            <div className="md:col-span-2">
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
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-black/10 bg-black/[0.02] px-5 py-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-black/55">
            Make sure your shipping details are correct to avoid delays in order
            fulfillment.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-xs px-6 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.10)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)`,
            }}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </form>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[80px_minmax(0,1fr)] md:gap-6">
      <div>
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-xs border border-black/10 bg-black/[0.03] px-2 text-[11px] font-semibold text-black/55">
          {eyebrow}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-black md:text-xl">{title}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  disabled = false,
  placeholder = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="group">
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="h-14 w-full rounded-xs border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black/25 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.03)] disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:text-black/45"
        />
        {!disabled && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--brand-red)] transition-transform duration-300 group-focus-within:scale-x-100" />
        )}
      </div>
    </div>
  );
}

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
    <div className="group">
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
        {label}
      </label>

      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={5}
          placeholder={placeholder}
          className="w-full rounded-xs border border-black/10 bg-white px-4 py-4 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black/25 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.03)]"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--brand-red)] transition-transform duration-300 group-focus-within:scale-x-100" />
      </div>
    </div>
  );
}