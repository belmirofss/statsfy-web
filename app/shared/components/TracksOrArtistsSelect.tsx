import { Select, Text } from "@radix-ui/themes";
import { SpotifyModes } from "../types";

type Props = {
  value: SpotifyModes;
  onChange: (mode: SpotifyModes) => void;
};

export const TracksOrArtistsSelect = ({ value, onChange }: Props) => {
  return (
    <Select.Root
      size="3"
      defaultValue={value}
      onValueChange={(value) => onChange(value as SpotifyModes)}
    >
      <Select.Trigger radius="full" />
      <Select.Content color="gray" highContrast>
        <Select.Group>
          {[
            [SpotifyModes.TRACKS, "Tracks"],
            [SpotifyModes.ARTISTS, "Artists"],
          ].map(([value, label]) => (
            <Select.Item value={value} key={value}>
              <Text size="5" weight="bold">
                {label}
              </Text>
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};
