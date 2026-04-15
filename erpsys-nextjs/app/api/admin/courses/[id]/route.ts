import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateAdmin } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { courseCode, courseName, credits, departmentId } = body;

    const course = await prisma.course.update({
      where: { id },
      data: {
        courseCode,
        courseName,
        credits: parseInt(credits) || 3,
        departmentId,
      },
      include: { department: true },
    });

    return NextResponse.json(course);
  } catch (error: any) {
    console.error("Error updating course:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting course:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
