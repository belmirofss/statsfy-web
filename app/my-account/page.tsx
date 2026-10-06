import { getAuthSession } from "../shared/actions/auth";
import { MyAccountContent } from "./components/MyAccountContent";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";

export default async function MyAccount() {
  const session = await getAuthSession();

  return session ? <MyAccountContent /> : <NotLoggedIn />;
}
