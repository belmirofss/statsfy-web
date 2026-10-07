import { ChallengeContent } from "./components/ChallengeContent";

// The challenge lives in the URL hash, which only the browser can read, and
// works without logging in: everything the game needs is in the link.
export default function Challenge() {
  return <ChallengeContent />;
}
