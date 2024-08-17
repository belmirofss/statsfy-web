import { Box, Tabs, Text } from "@radix-ui/themes";
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
      <Tabs.List size="2" color="gray" highContrast className="justify-center">
        {[
          [TimeRangeTabsValues.ALL_TIME, "All time"],
          [TimeRangeTabsValues.LAST_6_MONTHS, "Last 6 months"],
          [TimeRangeTabsValues.LAST_4_WEEKS, "Last 4 weeks"],
        ].map(([value, label]) => (
          <Tabs.Trigger key={value} value={value}>
            <Text size="3" className="font-bold">
              {label}
            </Text>
          </Tabs.Trigger>
        ))}
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
