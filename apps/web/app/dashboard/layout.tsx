import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("typebuilder_token");

  if (!token?.value) {
    redirect("/login");
  }

  return <>{children}</>;
}
