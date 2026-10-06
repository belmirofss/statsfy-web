import { MatchContent } from "./components/MatchContent";

// The match data lives in the URL hash, which only the browser can read, so
// this page decides between the invite and the result on the client.
export default function Match() {
  return <MatchContent />;
}
