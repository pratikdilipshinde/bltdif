"use client";

import { FormEvent, useEffect, useState } from "react";

type UserProfileResponse = {
  id?: string;
  userId: string;
  phoneNumber?: string | null;
  currentAddress?: string | null;
  shippingAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    email?: string | null;
    firstname?: string | null;
    lastname?: string | null;
  };
};

export default function ProfilePage() {
  const [userId, setUserId] = useState("");
  const [form, setForm] = useState({
    phoneNumber: "",
    currentAddress: "",
    shippingAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [savedProfile, setSavedProfile] = useState<UserProfileResponse | null>(null);

  const fetchProfile = async () => {
    if (!userId.trim()) {
      setMessage("Please enter a valid userId first.");
      return;
    }

    try {
      setFetching(true);
      setMessage("");

      const res = await fetch(`/api/user-profile?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();

      if (!res.ok) {
        setSavedProfile(null);
        setMessage(data.error || "Failed to fetch profile.");
        return;
      }

      if (data.data) {
        setSavedProfile(data.data);
        setForm({
          phoneNumber: data.data.phoneNumber || "",
          currentAddress: data.data.currentAddress || "",
          shippingAddress: data.data.shippingAddress || "",
          city: data.data.city || "",
          state: data.data.state || "",
          zipCode: data.data.zipCode || "",
          country: data.data.country || "",
        });
        setMessage("Profile loaded successfully.");
      } else {
        setSavedProfile(null);
        setForm({
          phoneNumber: "",
          currentAddress: "",
          shippingAddress: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        });
        setMessage("No UserProfile found for this userId yet.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch profile.");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      setMessage("Please enter a valid userId.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to save profile.");
        return;
      }

      setSavedProfile(data.data);
      setMessage("Profile saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optional: prefill a known Profile.id manually here later
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-black">User Profile Test</h1>
      <p className="mt-2 text-sm text-black/60">
        Enter a real <code>Profile.id</code> to create or fetch a related UserProfile record.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-6">
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-black">
              User ID (must exist in Profile table)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Paste Profile.id here"
                className="w-full rounded-md border border-black/15 px-3 py-2 text-sm text-black outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={fetchProfile}
                disabled={fetching}
                className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium text-black hover:bg-black/5 disabled:opacity-60"
              >
                {fetching ? "Loading..." : "Load"}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-black">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full rounded-md border border-black/15 px-3 py-2 text-sm text-black outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-black">
                Current Address
              </label>
              <textarea
                name="currentAddress"
                value={form.currentAddress}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-black/15 px-3 py-2 text-sm text-black outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-black">
                Shipping Address
              </label>
              <textarea
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-black/15 px-3 py-2 text-sm text-black outline-none focus:border-black"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-black">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-md border border-black/15 px-3 py-2 text-sm text-black outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-black">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full rounded-md border border-black/15 px-3 py-2 text-sm text-black outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-black">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  className="w-full rounded-md border border-black/15 px-3 py-2 text-sm text-black outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-black">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full rounded-md border border-black/15 px-3 py-2 text-sm text-black outline-none focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-md bg-black px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save User Profile"}
            </button>

            {message ? (
              <p className="text-sm text-blue-600">{message}</p>
            ) : null}
          </form>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-6">
          <h2 className="text-xl font-semibold text-black">Saved Profile Data</h2>

          {savedProfile ? (
            <div className="mt-5 space-y-3 text-sm text-black/80">
              <div>
                <span className="font-semibold text-black">UserProfile ID:</span>{" "}
                {savedProfile.id}
              </div>
              <div>
                <span className="font-semibold text-black">User ID:</span>{" "}
                {savedProfile.userId}
              </div>
              <div>
                <span className="font-semibold text-black">Phone:</span>{" "}
                {savedProfile.phoneNumber || "-"}
              </div>
              <div>
                <span className="font-semibold text-black">Current Address:</span>{" "}
                {savedProfile.currentAddress || "-"}
              </div>
              <div>
                <span className="font-semibold text-black">Shipping Address:</span>{" "}
                {savedProfile.shippingAddress || "-"}
              </div>
              <div>
                <span className="font-semibold text-black">City:</span>{" "}
                {savedProfile.city || "-"}
              </div>
              <div>
                <span className="font-semibold text-black">State:</span>{" "}
                {savedProfile.state || "-"}
              </div>
              <div>
                <span className="font-semibold text-black">Zip Code:</span>{" "}
                {savedProfile.zipCode || "-"}
              </div>
              <div>
                <span className="font-semibold text-black">Country:</span>{" "}
                {savedProfile.country || "-"}
              </div>
              <div>
                <span className="font-semibold text-black">Created At:</span>{" "}
                {savedProfile.createdAt || "-"}
              </div>
              <div>
                <span className="font-semibold text-black">Updated At:</span>{" "}
                {savedProfile.updatedAt || "-"}
              </div>

              <div className="mt-6 border-t border-black/10 pt-4">
                <p className="mb-2 text-sm font-semibold text-black">
                  Linked Profile Table Data
                </p>
                <div>
                  <span className="font-semibold text-black">Email:</span>{" "}
                  {savedProfile.user?.email || "-"}
                </div>
                <div>
                  <span className="font-semibold text-black">First Name:</span>{" "}
                  {savedProfile.user?.firstname || "-"}
                </div>
                <div>
                  <span className="font-semibold text-black">Last Name:</span>{" "}
                  {savedProfile.user?.lastname || "-"}
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-black/60">
              No UserProfile loaded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}