import { getAuthSession } from "../shared/actions/auth";
import { ShareContent } from "./components/ShareContent";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";

export default async function Share() {
  const session = await getAuthSession();

  return session ? <ShareContent /> : <NotLoggedIn />;
}
