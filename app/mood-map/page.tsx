import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";
import { MoodMapContent } from "./components/MoodMapContent";

export default async function MoodMap() {
  const session = await getAuthSession();

  return session ? <MoodMapContent /> : <NotLoggedIn feature="moodMap" />;
}
