import { Text } from "@radix-ui/themes";
import { Logo } from "../shared/components/Logo";
import { AboutButtons } from "./components/AboutButtons";

export default function About() {
  return (
    <div className="flex flex-col gap-2">
      <div className="mb-4">
        <Logo />
      </div>

      <Text size="5" weight="bold">
        All your data is saved exclusively on your device.
      </Text>
      <Text size="4">
        Statsfy will never save or collect any information about you or your
        account.
      </Text>
      <Text size="4">
        Statsfy is independent and hass no relationshiop with Spotify.
      </Text>
      <div className="mt-4">
        <AboutButtons />
      </div>
    </div>
  );
}
