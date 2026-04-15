import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const courses = await prisma.course.findMany({
      include: { department: true },
      orderBy: { courseCode: "asc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { courseCode, courseName, credits, departmentId } = body;

    if (!courseCode || !courseName || !departmentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        courseCode,
        courseName,
        credits: parseInt(credits) || 3,
        departmentId,
      },
      include: { department: true },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error("Error creating course:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Course code already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
