import { Metadata } from "next";
import Link from "next/link";
import { Button } from "./shared/components/Button";
import { Logo } from "./shared/components/Logo";
import { FEATURE_LIST } from "./shared/features";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[880px] flex-col gap-12 px-5 py-6 lg:py-8">
      <Link href="/" aria-label="Statsfy home" className="self-start">
        <Logo />
      </Link>

      <main className="flex flex-col items-start gap-5">
        <p className="eyebrow text-main">404</p>
        <h1 className="font-display text-[36px] font-bold leading-tight tracking-[-0.03em] lg:text-[48px]">
          This page skipped a beat.
        </h1>
        <p className="max-w-[480px] text-[17px] leading-relaxed text-soft">
          The page you&apos;re looking for doesn&apos;t exist. Try one of these instead.
        </p>
        <Button href="/">Go to Statsfy</Button>

        <ul className="mt-4 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_LIST.map((feature) => (
            <li key={feature.href}>
              <Link
                href={feature.href}
                className="card flex h-full flex-col gap-1 p-4 transition hover:border-edge hover:bg-raised/40"
              >
                <span className="text-[15px] font-extrabold">{feature.title}</span>
                <span className="text-sm leading-relaxed text-muted">{feature.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
