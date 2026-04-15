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

    const marks = await prisma.studentMark.findMany({
      where: { studentId: student.id },
      include: {
        assessment: {
          include: {
            class: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: marks.map((mark) => ({
        courseCode: mark.assessment.class.course.courseCode,
        courseName: mark.assessment.class.course.courseName,
        assessmentName: mark.assessment.assessmentName,
        marksObtained: mark.marksObtained,
        maxMarks: mark.assessment.maxMarks,
        percentage: (
          (mark.marksObtained / mark.assessment.maxMarks) *
          100
        ).toFixed(2),
        status: mark.marksObtained >= mark.assessment.maxMarks * 0.5 ? "Pass" : "Fail",
      })),
    });
  } catch (error) {
    console.error("Grades fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
