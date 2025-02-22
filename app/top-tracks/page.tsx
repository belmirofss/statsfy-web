import {
  TimeRangeAllTimeTab,
  TimeRangeLast4WeeksTab,
  TimeRangeLast6MonthsTab,
  TimeRangeTabs,
} from "@/app/shared/components/TimeRangeTabs";
import { TopTracksRanking } from "./components/TopTracksRanking";
import { SpotifyTimeRanges } from "@/app/shared/types";
import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";

export default async function TopTracks() {
  const session = await getAuthSession();

  return (
    <TimeRangeTabs>
      <TimeRangeAllTimeTab>
        {session ? (
          <TopTracksRanking timeRange={SpotifyTimeRanges.LONG} />
        ) : (
          <NotLoggedIn />
        )}
      </TimeRangeAllTimeTab>

      <TimeRangeLast6MonthsTab>
        {session ? (
          <TopTracksRanking timeRange={SpotifyTimeRanges.MEDIUM} />
        ) : (
          <NotLoggedIn />
        )}
      </TimeRangeLast6MonthsTab>

      <TimeRangeLast4WeeksTab>
        {session ? (
          <TopTracksRanking timeRange={SpotifyTimeRanges.SHORT} />
        ) : (
          <NotLoggedIn />
        )}
      </TimeRangeLast4WeeksTab>
    </TimeRangeTabs>
  );
}
