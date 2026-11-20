import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = { title: "Админ-панель", robots: { index: false, follow: false } };

// Checked on the server for every request: guests are sent to sign in, and signed-in
// users without the admin role get a plain 404, so the panel's code is never sent to them.
export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "admin") notFound();
  return <AdminDashboard />;
}
