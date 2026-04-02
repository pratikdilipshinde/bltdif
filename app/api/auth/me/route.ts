import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstname: profile?.firstname ?? null,
          lastname: profile?.lastname ?? null,
          role: profile?.role ?? "USER",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ME ERROR:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}