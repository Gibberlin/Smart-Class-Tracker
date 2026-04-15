import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { table: string } }
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
    const limit = 50;

    // Map table names to Prisma models
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

    // Execute the query
    const data = await (prisma[model] as any).findMany({
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error("CRUD read error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { table: string } }
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

    // Create the record
    const data = await (prisma[model] as any).create({
      data: body,
    });

    return NextResponse.json(
      {
        success: true,
        data,
        message: "Record created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CRUD create error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
