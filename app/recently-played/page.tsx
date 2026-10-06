import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";
import { RecentlyPlayedList } from "./components/RecentlyPlayedList";

export default async function RecentlyPlayed() {
  const session = await getAuthSession();

  return session ? <RecentlyPlayedList /> : <NotLoggedIn feature="recentlyPlayed" />;
}
