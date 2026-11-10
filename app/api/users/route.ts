import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  listUsers
} from "@/lib/server/users-store";
import type { CreateUserInput } from "@/types/user";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? 5), 1),
    50
  );

  const users = await listUsers(search);
  const total = users.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;

  return NextResponse.json({
    data: users.slice(start, start + limit),
    total,
    page: safePage,
    limit,
    totalPages
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateUserInput;

    if (!body.name || !body.email) {
      return NextResponse.json(
        { message: "Name and email are required." },
        { status: 400 }
      );
    }

    const user = await createUser({
      name: body.name,
      email: body.email,
      phone: body.phone ?? "",
      website: body.website ?? "",
      active: true
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }
}
