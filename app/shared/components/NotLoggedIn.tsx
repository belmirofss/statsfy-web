import { LuShieldCheck } from "react-icons/lu";
import { SpotifyLoginButton } from "./SpotifyLoginButton";

export const NotLoggedIn = () => {
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-10 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.02em]">
          Hey, you have not connected with your Spotify account.
        </h1>
        <p className="text-[16px] leading-relaxed text-soft">
          Log in with Spotify to see your most listened tracks and artists
          across time ranges, and share them with your friends.
        </p>
      </div>

      <SpotifyLoginButton />

      <p className="flex items-center gap-2 text-sm text-muted">
        <LuShieldCheck aria-hidden size={16} />
        Nothing is stored on our servers.
      </p>
    </div>
  );
};
