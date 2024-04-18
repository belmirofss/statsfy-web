import { getAuthSession } from "@/app/shared/utils/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  return <h1>it works</h1>;
}
