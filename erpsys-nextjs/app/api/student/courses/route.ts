import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "STUDENT") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { userId: user.userId },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: {
        class: {
          include: {
            course: true,
            instructor: true,
            semester: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: enrollments.map((enrollment) => ({
        enrollmentId: enrollment.id,
        courseCode: enrollment.class.course.courseCode,
        courseName: enrollment.class.course.courseName,
        credits: enrollment.class.course.credits,
        instructor: enrollment.class.instructor.name,
        schedule: enrollment.class.schedule,
        location: enrollment.class.location,
        semester: enrollment.class.semester.semesterName,
        finalGrade: enrollment.finalGrade,
      })),
    });
  } catch (error) {
    console.error("Courses fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
