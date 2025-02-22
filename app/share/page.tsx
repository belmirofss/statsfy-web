import { getAuthSession } from "../shared/actions/auth";
import { ShareContent } from "./components/ShareContent";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";

export default async function Share() {
  const session = await getAuthSession();

  return (
    <div className="flex flex-col items-center">
      {session ? <ShareContent /> : <NotLoggedIn />}
    </div>
  );
}
