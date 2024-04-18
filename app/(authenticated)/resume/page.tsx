import { redirect } from "next/navigation";
import { getAuthSession } from "@/app/shared/actions/auth";

export default async function Resume() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  return <h1>it works</h1>;
}
