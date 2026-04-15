import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { table: string; id: string } }
) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const table = params.table.toLowerCase();
    const id = parseInt(params.id, 10);
    const body = await request.json();

    const tableMap: {
      [key: string]: keyof typeof prisma;
    } = {
      students: "student",
      instructors: "instructor",
      courses: "course",
      departments: "department",
      classes: "class",
      semesters: "semester",
      enrollments: "enrollment",
      assessments: "assessment",
      studentmarks: "studentMark",
      users: "user",
    };

    const model = tableMap[table];
    if (!model) {
      return NextResponse.json(
        { success: false, message: "Invalid table name" },
        { status: 400 }
      );
    }

    const data = await (prisma[model] as any).update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data,
      message: "Record updated successfully",
    });
  } catch (error) {
    console.error("CRUD update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { table: string; id: string } }
) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const table = params.table.toLowerCase();
    const id = parseInt(params.id, 10);

    const tableMap: {
      [key: string]: keyof typeof prisma;
    } = {
      students: "student",
      instructors: "instructor",
      courses: "course",
      departments: "department",
      classes: "class",
      semesters: "semester",
      enrollments: "enrollment",
      assessments: "assessment",
      studentmarks: "studentMark",
      users: "user",
    };

    const model = tableMap[table];
    if (!model) {
      return NextResponse.json(
        { success: false, message: "Invalid table name" },
        { status: 400 }
      );
    }

    await (prisma[model] as any).delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("CRUD delete error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
