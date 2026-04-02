import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const firstname = String(body.firstname ?? "").trim();
    const lastname = String(body.lastname ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!firstname) {
      return jsonError("First name is required.", 400);
    }

    if (!lastname) {
      return jsonError("Last name is required.", 400);
    }

    if (!email || !password) {
      return jsonError("Email and password are required.", 400);
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return jsonError("Please enter a valid email address.", 400);
    }

    if (password.length < 8) {
      return jsonError("Password must be at least 8 characters.", 400);
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
      const msg = error.message.toLowerCase();

      if (msg.includes("user already registered")) {
        return jsonError(
          "An account with this email already exists. Please login instead.",
          409
        );
      }

      if (msg.includes("password")) {
        return jsonError("Password must be at least 8 characters.", 400);
      }

      if (
        msg.includes("invalid email") ||
        msg.includes("unable to validate email")
      ) {
        return jsonError("Please enter a valid email address.", 400);
      }

      return jsonError(error.message || "Unable to create account.", 400);
    }

    if (!data.user) {
      return jsonError("Unable to create account.", 500);
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
        message:
          "Account created successfully. Please check your email to verify your account.",
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return jsonError("Something went wrong during registration.", 500);
  }
}