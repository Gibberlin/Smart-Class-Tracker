import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const [studentCount, courseCount, instructorCount, departmentCount] =
      await Promise.all([
        prisma.student.count(),
        prisma.course.count(),
        prisma.instructor.count(),
        prisma.department.count(),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        studentCount,
        courseCount,
        instructorCount,
        departmentCount,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
