import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    return NextResponse.json(
      { success: true, data: profile },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/user-profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userId,
      phoneNumber,
      currentAddress,
      shippingAddress,
      city,
      state,
      zipCode,
      country,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid userId. Matching Profile record not found.",
        },
        { status: 404 }
      );
    }

    const savedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        phoneNumber: phoneNumber || null,
        currentAddress: currentAddress || null,
        shippingAddress: shippingAddress || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        country: country || null,
      },
      create: {
        userId,
        phoneNumber: phoneNumber || null,
        currentAddress: currentAddress || null,
        shippingAddress: shippingAddress || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        country: country || null,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(
      { success: true, data: savedProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/user-profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save user profile" },
      { status: 500 }
    );
  }
}