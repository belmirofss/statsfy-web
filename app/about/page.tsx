import { Text } from "@radix-ui/themes";
import { AboutButtons } from "./components/AboutButtons";
import { Logo } from "@/app/shared/components/Logo";

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
        By logging in with your Spotify account, you will beautifully discover
        stats from your account. You can view your most listened tracks and
        artists across time ranges and easily share them with your friends!
      </Text>
      <Text size="4">
        Statsfy will never save or collect any information about you or your
        account.
      </Text>
      <Text size="4">
        Statsfy is independent and does not have relationshiop with Spotify.
      </Text>

      <div className="mt-4">
        <AboutButtons />
      </div>
    </div>
  );
}
