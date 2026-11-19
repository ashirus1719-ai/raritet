import { auth } from "@/auth";

export async function getAdminUser() {
  const session = await auth();
  if (session?.user?.role !== "admin" || !session.user.id) return null;
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
}

export async function isAdmin() {
  return (await getAdminUser()) !== null;
}
