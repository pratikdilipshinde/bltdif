import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@/app/lib/supabase/server";
import { profileFormSchema } from "@/app/lib/validators/profile";

function normalizeOptional(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { email: user.email },
      include: {
        userProfile: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        {
          profile: {
            email: user.email,
            firstname: "",
            lastname: "",
            phoneNumber: "",
            currentAddress: "",
            shippingAddress: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      profile: {
        email: profile.email,
        firstname: profile.firstname ?? "",
        lastname: profile.lastname ?? "",
        phoneNumber: profile.userProfile?.phoneNumber ?? "",
        currentAddress: profile.userProfile?.currentAddress ?? "",
        shippingAddress: profile.userProfile?.shippingAddress ?? "",
        city: profile.userProfile?.city ?? "",
        state: profile.userProfile?.state ?? "",
        zipCode: profile.userProfile?.zipCode ?? "",
        country: profile.userProfile?.country ?? "",
      },
    });
  } catch (error) {
    console.error("GET /api/user-profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const savedProfile = await prisma.profile.upsert({
      where: { email: user.email },
      create: {
        email: user.email,
        firstname: normalizeOptional(data.firstname),
        lastname: normalizeOptional(data.lastname),
        userProfile: {
          create: {
            phoneNumber: normalizeOptional(data.phoneNumber),
            currentAddress: normalizeOptional(data.currentAddress),
            shippingAddress: normalizeOptional(data.shippingAddress),
            city: normalizeOptional(data.city),
            state: normalizeOptional(data.state),
            zipCode: normalizeOptional(data.zipCode),
            country: normalizeOptional(data.country),
          },
        },
      },
      update: {
        firstname: normalizeOptional(data.firstname),
        lastname: normalizeOptional(data.lastname),
        userProfile: {
          upsert: {
            create: {
              phoneNumber: normalizeOptional(data.phoneNumber),
              currentAddress: normalizeOptional(data.currentAddress),
              shippingAddress: normalizeOptional(data.shippingAddress),
              city: normalizeOptional(data.city),
              state: normalizeOptional(data.state),
              zipCode: normalizeOptional(data.zipCode),
              country: normalizeOptional(data.country),
            },
            update: {
              phoneNumber: normalizeOptional(data.phoneNumber),
              currentAddress: normalizeOptional(data.currentAddress),
              shippingAddress: normalizeOptional(data.shippingAddress),
              city: normalizeOptional(data.city),
              state: normalizeOptional(data.state),
              zipCode: normalizeOptional(data.zipCode),
              country: normalizeOptional(data.country),
            },
          },
        },
      },
      include: {
        userProfile: true,
      },
    });

    return NextResponse.json({
      message: "Profile saved successfully",
      profile: {
        email: savedProfile.email,
        firstname: savedProfile.firstname ?? "",
        lastname: savedProfile.lastname ?? "",
        phoneNumber: savedProfile.userProfile?.phoneNumber ?? "",
        currentAddress: savedProfile.userProfile?.currentAddress ?? "",
        shippingAddress: savedProfile.userProfile?.shippingAddress ?? "",
        city: savedProfile.userProfile?.city ?? "",
        state: savedProfile.userProfile?.state ?? "",
        zipCode: savedProfile.userProfile?.zipCode ?? "",
        country: savedProfile.userProfile?.country ?? "",
      },
    });
  } catch (error) {
    console.error("PUT /api/user-profile error:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}