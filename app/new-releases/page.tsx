import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";
import { NewReleasesContent } from "./components/NewReleasesContent";

export default async function NewReleases() {
  const session = await getAuthSession();

  return session ? <NewReleasesContent /> : <NotLoggedIn />;
}
