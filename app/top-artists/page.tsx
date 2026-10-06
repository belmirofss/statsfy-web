import { TopArtistsRanking } from "./components/TopArtistsRanking";
import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";

export default async function TopArtists() {
  const session = await getAuthSession();

  return session ? <TopArtistsRanking /> : <NotLoggedIn />;
}
