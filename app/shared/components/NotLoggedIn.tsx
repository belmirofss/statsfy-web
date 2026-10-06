import Link from "next/link";
import { LuLock, LuShieldCheck } from "react-icons/lu";
import { FEATURES, FEATURE_LIST, FeatureKey } from "../features";
import { SpotifyLoginButton } from "./SpotifyLoginButton";

type Props = {
  // Describes the page's feature, so each page has its own content for
  // logged out visitors and search engines
  feature?: FeatureKey;
};

export const NotLoggedIn = ({ feature }: Props) => {
  const current = feature ? FEATURES[feature] : undefined;
  const others = FEATURE_LIST.filter((item) => item !== current);

  return (
    <div className="flex flex-col gap-12">
      <section className="card mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-6 py-10 text-center">
        {current && <div className="w-full max-w-[320px] text-left">{current.preview}</div>}

        <div className="flex flex-col gap-3">
          {current && <p className="eyebrow text-main">{current.title}</p>}
          <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.02em]">
            {current?.heading ?? "Hey, you have not connected with your Spotify account."}
          </h1>
          <p className="text-[16px] leading-relaxed text-soft">
            {current?.intro ??
              "Connect your account to see your listening stats and share them with friends."}
          </p>
        </div>

        <SpotifyLoginButton callbackPath={current?.href} />

        <div className="flex flex-col items-center gap-1.5 text-sm text-muted">
          <p className="flex items-center gap-2">
            <LuLock aria-hidden size={16} className="shrink-0" />
            You log in on Spotify&apos;s own site. Statsfy never sees your password.
          </p>
          <p className="flex items-center gap-2">
            <LuShieldCheck aria-hidden size={16} className="shrink-0" />
            Nothing is stored on our servers.
          </p>
        </div>
      </section>

      <nav aria-labelledby="more-stats" className="flex flex-col gap-4">
        <h2 id="more-stats" className="font-display text-xl font-bold">
          More of your Spotify stats
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="card flex h-full flex-col gap-1 p-4 transition hover:border-edge hover:bg-raised/40"
              >
                <span className="text-[15px] font-extrabold">{item.title}</span>
                <span className="text-sm leading-relaxed text-muted">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="text-[13px] leading-relaxed text-muted">
        Statsfy is an independent app and is not affiliated with, endorsed or sponsored by Spotify.
      </p>
    </div>
  );
};
