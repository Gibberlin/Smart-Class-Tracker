import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Student Login - ERP System",
};

export default function StudentLoginPage() {
  return <LoginForm userType="student" />;
}
