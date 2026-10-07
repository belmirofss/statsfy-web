import { ReactNode } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import { Cover } from "@/app/shared/components/Cover";
import { getTierIndex, TIERS } from "@/app/shared/helpers/knowYourself";

type Props = {
  eyebrow: string;
  score: number;
  total: number;
  // Right or wrong for each round
  results: boolean[];
  // Replaces the tier name and text, for friends playing a challenge
  headline?: { title: string; text: string };
  surprise?: { text: string; image?: string };
  actions: ReactNode;
};

export const GameResults = ({ eyebrow, score, total, results, headline, surprise, actions }: Props) => {
  const tierIndex = getTierIndex(score, total);
  const tier = TIERS[tierIndex];

  return (
    <section className="card flex flex-col gap-6 rounded-3xl p-5 lg:flex-row lg:flex-wrap lg:gap-8 lg:p-7">
      <div className="flex min-w-0 flex-col gap-3.5 lg:flex-[1_1_320px]">
        <p className="eyebrow text-main">{eyebrow}</p>
        <p className="flex items-baseline gap-2">
          <span className="font-display text-[80px] font-bold leading-[0.85] tracking-[-0.04em] text-main lg:text-[112px]">
            {score}
          </span>
          <span className="font-display text-2xl font-bold text-muted lg:text-[32px]">/ {total}</span>
        </p>
        <p className="font-display text-[28px] font-bold tracking-[-0.02em] lg:text-[36px]">
          {headline?.title ?? tier.name}
        </p>
        <p className="max-w-[440px] text-[15px] leading-relaxed text-soft">{headline?.text ?? tier.text}</p>
        {!headline && (
          <ol aria-label="Levels" className="grid max-w-[440px] grid-cols-4 gap-1.5">
            {TIERS.map((item, index) => (
              <li key={item.name} className="flex flex-col gap-1.5">
                <span className={`h-1.5 rounded-full ${index <= tierIndex ? "bg-main" : "bg-edge"}`} />
                <span
                  aria-current={index === tierIndex ? "step" : undefined}
                  className={`text-[11px] font-bold lg:text-xs ${index === tierIndex ? "text-fg" : "text-muted"}`}
                >
                  {item.name}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-4 lg:flex-[1_1_300px]">
        <ol aria-label="Your answers" className="flex flex-wrap gap-1.5">
          {results.map((correct, index) => (
            <li
              key={index}
              aria-label={`Round ${index + 1}: ${correct ? "right" : "wrong"}`}
              className={`flex h-8 w-8 items-center justify-center rounded-lg lg:h-10 lg:w-10 lg:rounded-[10px] ${
                correct ? "bg-main text-on-main" : "bg-warn text-[#2A1305]"
              }`}
            >
              {correct ? <LuCheck aria-hidden size={18} strokeWidth={3} /> : <LuX aria-hidden size={16} strokeWidth={3} />}
            </li>
          ))}
        </ol>

        {surprise && (
          <div className="flex items-center gap-3.5 rounded-[20px] bg-raised p-4">
            <Cover src={surprise.image} alt="" size={60} radius="rounded-xl" />
            <p className="flex flex-col gap-0.5">
              <span className="eyebrow text-[11px] text-warn">Biggest surprise</span>
              <span className="text-sm font-semibold leading-snug lg:text-[15px]">{surprise.text}</span>
            </p>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">{actions}</div>
      </div>
    </section>
  );
};
