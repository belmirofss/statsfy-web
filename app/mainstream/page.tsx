import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";
import { MainstreamContent } from "./components/MainstreamContent";

export default async function Mainstream() {
  const session = await getAuthSession();

  return session ? <MainstreamContent /> : <NotLoggedIn feature="mainstream" />;
}
