import { TopTracksRanking } from "./components/TopTracksRanking";
import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";

export default async function TopTracks() {
  const session = await getAuthSession();

  return session ? <TopTracksRanking /> : <NotLoggedIn />;
}
