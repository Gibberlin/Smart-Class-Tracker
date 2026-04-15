import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const students = await prisma.student.findMany({
      include: { department: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, rollNo, email, phone, departmentId, username, password } = body;

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: password, // Should be hashed in real implementation
        role: "STUDENT",
      },
    });

    // Create student
    const student = await prisma.student.create({
      data: {
        userId: newUser.id,
        name,
        rollNo,
        email,
        phone,
        departmentId,
      },
      include: { department: true },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
