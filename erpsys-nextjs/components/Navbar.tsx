"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  userType: "admin" | "student";
  username: string;
}

export default function Navbar({ userType, username }: NavbarProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks =
    userType === "admin"
      ? [
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/students", label: "Students" },
          { href: "/admin/instructors", label: "Instructors" },
          { href: "/admin/courses", label: "Courses" },
        ]
      : [
          { href: "/student/dashboard", label: "Dashboard" },
          { href: "/student/courses", label: "My Courses" },
          { href: "/student/grades", label: "Grades" },
          { href: "/student/profile", label: "Profile" },
        ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href={userType === "admin" ? "/admin/dashboard" : "/student/dashboard"}
            className="text-2xl font-bold text-teal-600"
          >
            ERP System
          </Link>

          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition"
            >
              <span>{username}</span>
              <svg
                className={`w-4 h-4 transform transition ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                <Link
                  href={
                    userType === "admin" ? "/admin/profile" : "/student/profile"
                  }
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
