import { NextRequest, NextResponse } from "next/server";
import {
  deleteUser,
  findUser,
  updateUser
} from "@/lib/server/users-store";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  const user = await findUser(Number(id));

  if (!user) {
    return NextResponse.json(
      { message: "User not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

export async function PATCH(
  request: NextRequest,
  context: Context
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const user = await updateUser(Number(id), body);

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  const user = await deleteUser(Number(id));

  if (!user) {
    return NextResponse.json(
      { message: "User not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}
