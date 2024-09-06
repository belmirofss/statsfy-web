import { Select as SelectRadix, Text } from "@radix-ui/themes";

type Props = {
  value: string | undefined;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
};

export const Select = ({ value, onChange, options }: Props) => {
  return (
    <SelectRadix.Root
      size="3"
      defaultValue={value}
      onValueChange={(value) => onChange(value)}
    >
      <SelectRadix.Trigger radius="full" />
      <SelectRadix.Content color="gray" highContrast>
        <SelectRadix.Group>
          {options.map(({ value, label }) => (
            <SelectRadix.Item value={value} key={value}>
              <Text size="5" weight="bold">
                {label}
              </Text>
            </SelectRadix.Item>
          ))}
        </SelectRadix.Group>
      </SelectRadix.Content>
    </SelectRadix.Root>
  );
};
