import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";
import { TimeMachineContent } from "./components/TimeMachineContent";

export default async function TimeMachine() {
  const session = await getAuthSession();

  return session ? <TimeMachineContent /> : <NotLoggedIn feature="timeMachine" />;
}
