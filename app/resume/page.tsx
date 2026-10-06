import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";
import { Overview } from "./components/Overview";

export default async function Resume() {
  const session = await getAuthSession();

  return session ? <Overview /> : <NotLoggedIn />;
}
