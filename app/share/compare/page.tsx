import { Metadata } from "next";
import { getAuthSession } from "../../shared/actions/auth";
import { NotLoggedIn } from "../../shared/components/NotLoggedIn";
import { CompareContent } from "../components/CompareContent";

export const metadata: Metadata = {
  // The share layout sets a plain title, so the root template does not reach this page
  title: { absolute: "Compare your Spotify taste with a friend | Statsfy" },
  description:
    "Send a friend a link and see how much your Spotify music taste matches, with your taste match score.",
};

export default async function Compare() {
  const session = await getAuthSession();

  return session ? <CompareContent /> : <NotLoggedIn feature="tasteMatch" />;
}
