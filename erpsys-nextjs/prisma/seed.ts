import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      passwordHash: await bcrypt.hash("admin123", 10),
    },
    create: {
      username: "admin",
      email: "admin@erp.local",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user created:", adminUser.username);

  // Create departments
  const deptCSE = await prisma.department.upsert({
    where: { departmentName: "Computer Science & Engineering" },
    update: {},
    create: {
      departmentName: "Computer Science & Engineering",
    },
  });

  const deptECE = await prisma.department.upsert({
    where: { departmentName: "Electronics & Communication" },
    update: {},
    create: {
      departmentName: "Electronics & Communication",
    },
  });

  const deptME = await prisma.department.upsert({
    where: { departmentName: "Mechanical Engineering" },
    update: {},
    create: {
      departmentName: "Mechanical Engineering",
    },
  });

  console.log("✓ Departments created");

  // Create instructors
  const instructor1 = await prisma.instructor.upsert({
    where: { email: "dr.sharma@erp.local" },
    update: {},
    create: {
      userId: adminUser.id,
      name: "Dr. Rajesh Sharma",
      email: "dr.sharma@erp.local",
      phone: "+91-9999999991",
      departmentId: deptCSE.id,
    },
  });

  console.log("✓ Instructors created");

  // Create students
  const studentUser1 = await prisma.user.upsert({
    where: { username: "student001" },
    update: {
      passwordHash: await bcrypt.hash("student123", 10),
    },
    create: {
      username: "student001",
      email: "student001@erp.local",
      passwordHash: await bcrypt.hash("student123", 10),
      role: "STUDENT",
    },
  });

  const student1 = await prisma.student.upsert({
    where: { email: "arjun@erp.local" },
    update: {},
    create: {
      userId: studentUser1.id,
      name: "Arjun Kumar",
      rollNo: "CSE21001",
      email: "arjun@erp.local",
      phone: "+91-8888888881",
      departmentId: deptCSE.id,
    },
  });

  console.log("✓ Students created");

  // Create semester
  const semester = await prisma.semester.upsert({
    where: { semesterName: "Semester 1, 2024-25" },
    update: {},
    create: {
      semesterName: "Semester 1, 2024-25",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2024-12-31"),
    },
  });

  console.log("✓ Semester created");

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { courseCode: "CSE101" },
    update: {},
    create: {
      courseCode: "CSE101",
      courseName: "Programming Fundamentals",
      credits: 4,
      departmentId: deptCSE.id,
    },
  });

  console.log("✓ Courses created");

  // Create classes
  let class1 = await prisma.class.findFirst({
    where: {
      courseId: course1.id,
      instructorId: instructor1.id,
      semesterId: semester.id,
    },
  });

  if (!class1) {
    class1 = await prisma.class.create({
      data: {
        courseId: course1.id,
        instructorId: instructor1.id,
        semesterId: semester.id,
        location: "Room 101",
        schedule: "Mon, Wed, Fri 10:00-11:00 AM",
      },
    });
  }

  console.log("✓ Classes created");

  // Create enrollments
  await prisma.enrollment.upsert({
    where: {
      studentId_classId: {
        studentId: student1.id,
        classId: class1.id,
      },
    },
    update: {},
    create: {
      studentId: student1.id,
      classId: class1.id,
    },
  });

  console.log("✓ Enrollments created");

  // Create assessments
  let assessment1 = await prisma.assessment.findFirst({
    where: {
      classId: class1.id,
      assessmentName: "Midterm Exam",
    },
  });

  if (!assessment1) {
    assessment1 = await prisma.assessment.create({
      data: {
        classId: class1.id,
        assessmentName: "Midterm Exam",
        maxMarks: 50,
        assessmentDate: new Date("2024-10-15"),
      },
    });
  }

  console.log("✓ Assessments created");

  // Add marks
  await prisma.studentMark.upsert({
    where: {
      studentId_assessmentId: {
        studentId: student1.id,
        assessmentId: assessment1.id,
      },
    },
    update: {},
    create: {
      studentId: student1.id,
      assessmentId: assessment1.id,
      marksObtained: 42,
    },
  });

  console.log("✓ Student marks added");
  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
