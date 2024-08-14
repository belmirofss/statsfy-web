import { Box, Tabs } from "@radix-ui/themes";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

enum TimeRangeTabsValues {
  ALL_TIME = "all-time",
  LAST_6_MONTHS = "last-6-months",
  LAST_4_WEEKS = "last-4-weeks",
}

export const TimeRangeTabs = ({ children }: Props) => {
  return (
    <Tabs.Root defaultValue={TimeRangeTabsValues.ALL_TIME}>
      <Tabs.List
        size="2"
        color="gray"
        highContrast
        className="justify-between md:justify-start"
      >
        <Tabs.Trigger value={TimeRangeTabsValues.ALL_TIME}>
          All time
        </Tabs.Trigger>
        <Tabs.Trigger value={TimeRangeTabsValues.LAST_6_MONTHS}>
          Last 6 months
        </Tabs.Trigger>
        <Tabs.Trigger value={TimeRangeTabsValues.LAST_4_WEEKS}>
          Last 4 weeks
        </Tabs.Trigger>
      </Tabs.List>

      <Box pt="3">{children}</Box>
    </Tabs.Root>
  );
};

export const TimeRangeAllTimeTab = ({ children }: Props) => {
  return (
    <Tabs.Content value={TimeRangeTabsValues.ALL_TIME}>{children}</Tabs.Content>
  );
};

export const TimeRangeLast6MonthsTab = ({ children }: Props) => {
  return (
    <Tabs.Content value={TimeRangeTabsValues.LAST_6_MONTHS}>
      {children}
    </Tabs.Content>
  );
};

export const TimeRangeLast4WeeksTab = ({ children }: Props) => {
  return (
    <Tabs.Content value={TimeRangeTabsValues.LAST_4_WEEKS}>
      {children}
    </Tabs.Content>
  );
};
