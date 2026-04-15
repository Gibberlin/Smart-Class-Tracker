import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Admin Login - ERP System",
};

export default function AdminLoginPage() {
  return <LoginForm userType="admin" />;
}
