import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const departments = await prisma.department.findMany({
      orderBy: { departmentName: "asc" },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { departmentName } = body;

    if (!departmentName) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 });
    }

    const department = await prisma.department.create({
      data: { departmentName },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    console.error("Error creating department:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Department already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 });
  }
}
