import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";
import { NowPlayingContent } from "./components/NowPlayingContent";

export default async function NowPlaying() {
  const session = await getAuthSession();

  return session ? <NowPlayingContent /> : <NotLoggedIn />;
}
