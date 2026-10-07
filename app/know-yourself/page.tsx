import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";
import { KnowYourselfContent } from "./components/KnowYourselfContent";

export default async function KnowYourself() {
  const session = await getAuthSession();

  return session ? <KnowYourselfContent /> : <NotLoggedIn feature="knowYourself" />;
}
