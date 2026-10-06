import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";
import { WorldMapContent } from "./components/WorldMapContent";

export default async function WorldMap() {
  const session = await getAuthSession();

  return session ? <WorldMapContent /> : <NotLoggedIn />;
}
