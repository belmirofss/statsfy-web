import { Metadata } from "next";
import { getAuthSession } from "../../shared/actions/auth";
import { NotLoggedIn } from "../../shared/components/NotLoggedIn";
import { CompareContent } from "../components/CompareContent";

export const metadata: Metadata = {
  title: "Statsfy | Compare with a friend",
  description: "Send a link and see how much your Spotify taste matches a friend's",
};

export default async function Compare() {
  const session = await getAuthSession();

  return session ? <CompareContent /> : <NotLoggedIn />;
}
