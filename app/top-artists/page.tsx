import {
  TimeRangeAllTimeTab,
  TimeRangeLast4WeeksTab,
  TimeRangeLast6MonthsTab,
  TimeRangeTabs,
} from "@/app/shared/components/TimeRangeTabs";
import { TopArtistsRanking } from "./components/TopArtistsRanking";
import { SpotifyTimeRanges } from "@/app/shared/types";
import { getAuthSession } from "../shared/actions/auth";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";

export default async function TopArtists() {
  const session = await getAuthSession();
  return (
    <TimeRangeTabs>
      <TimeRangeAllTimeTab>
        {session ? (
          <TopArtistsRanking timeRange={SpotifyTimeRanges.LONG} />
        ) : (
          <NotLoggedIn />
        )}
      </TimeRangeAllTimeTab>

      <TimeRangeLast6MonthsTab>
        {session ? (
          <TopArtistsRanking timeRange={SpotifyTimeRanges.MEDIUM} />
        ) : (
          <NotLoggedIn />
        )}
      </TimeRangeLast6MonthsTab>

      <TimeRangeLast4WeeksTab>
        {session ? (
          <TopArtistsRanking timeRange={SpotifyTimeRanges.SHORT} />
        ) : (
          <NotLoggedIn />
        )}
      </TimeRangeLast4WeeksTab>
    </TimeRangeTabs>
  );
}
