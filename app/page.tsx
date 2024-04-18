import { redirect } from "next/navigation";
import { getAuthSession } from "./shared/actions/auth";

export default async function Main() {
  const session = await getAuthSession();

  if (session) {
    redirect("/resume");
  } else {
    redirect("/login");
  }
}
