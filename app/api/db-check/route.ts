import { getSql } from "@/lib/db";

export async function GET() {
  try {
    const sql = getSql();
    await sql`SELECT 1`;

    return Response.json({ connected: true });
  } catch {
    return Response.json(
      { connected: false, error: "Database connection failed." },
      { status: 503 },
    );
  }
}
