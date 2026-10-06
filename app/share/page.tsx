import { Metadata } from "next";
import { getAuthSession } from "../shared/actions/auth";
import { ShareContent } from "./components/ShareContent";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";

// The share page only has content after logging in; the compare page below it stays indexable
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function Share() {
  const session = await getAuthSession();

  return session ? <ShareContent /> : <NotLoggedIn />;
}
