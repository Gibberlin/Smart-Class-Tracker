import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateAdmin } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateAdmin(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const department = await prisma.department.delete({
      where: { id },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 });
  }
}
