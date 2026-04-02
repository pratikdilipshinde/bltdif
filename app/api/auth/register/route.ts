import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const firstname = String(body.firstname ?? "").trim();
    const lastname = String(body.lastname ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstname,
          lastname,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Unable to create account." },
        { status: 500 }
      );
    }

    await prisma.profile.upsert({
      where: { id: data.user.id },
      update: {
        email,
        firstname: firstname || null,
        lastname: lastname || null,
      },
      create: {
        id: data.user.id,
        email,
        firstname: firstname || null,
        lastname: lastname || null,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong during registration." },
      { status: 500 }
    );
  }
}