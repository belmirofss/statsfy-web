import { redirect } from "next/navigation";

import { getAuthSession } from "./shared/utils/auth";

export default async function Main() {
  const session = await getAuthSession();

  if (session) {
    redirect("/home");
  } else {
    redirect("/login");
  }
}
