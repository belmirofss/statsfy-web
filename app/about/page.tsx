import { LuCoffee, LuPlus } from "react-icons/lu";
import { Button } from "@/app/shared/components/Button";
import { BUY_ME_A_COFFEE_URL } from "@/app/shared/constants";

const STEPS = [
  { title: "Connect", text: "Log in with Spotify. Read-only permissions." },
  { title: "We fetch live", text: "Your stats come straight from Spotify." },
  { title: "Nothing saved", text: "Statsfy never stores your data." },
];

const FAQ = [
  {
    question: "Why only 4 weeks, 6 months and all time?",
    answer: "Those are the three time ranges Spotify provides for top tracks and artists.",
  },
  {
    question: "Why are there ads?",
    answer: "Ads pay for keeping the website online, so Statsfy can stay free.",
  },
  {
    question: "How do I remove Statsfy's access?",
    answer:
      "Log out here, then remove Statsfy from the apps list in your Spotify account settings.",
  },
];

export default function About() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:pt-2">
      <div className="flex min-w-0 flex-col gap-6">
        <p className="eyebrow text-main">About Statsfy</p>
        <h1 className="font-display text-[32px] font-bold leading-[1.05] tracking-[-0.03em] lg:text-[52px] lg:leading-none">
          A small, independent app for the stats Spotify doesn&apos;t show you.
        </h1>
        <p className="text-base leading-relaxed text-soft lg:text-[17px]">
          By logging in with your Spotify account, you can view your most
          listened tracks and artists across time ranges and easily share them
          with your friends. Statsfy is independent and has no relationship
          with Spotify.
        </p>

        <ol id="privacy" className="grid scroll-mt-8 gap-3 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="card flex items-center gap-4 rounded-[18px] p-[18px] sm:block"
            >
              <span className="font-display text-[28px] font-bold text-main">
                {index + 1}
              </span>
              <div>
                <p className="text-[15px] font-extrabold sm:mt-1.5">{step.title}</p>
                <p className="mt-1 text-[13px] leading-snug text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="card divide-y divide-line">
          {FAQ.map((item, index) => (
            <details key={item.question} open={index === 0} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-extrabold [&::-webkit-details-marker]:hidden">
                {item.question}
                <LuPlus
                  aria-hidden
                  size={18}
                  className="shrink-0 text-muted transition group-open:rotate-45"
                />
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <aside className="flex flex-col gap-4">
        <div className="card flex flex-col items-start gap-3 rounded-3xl p-6">
          <LuCoffee aria-hidden size={28} className="text-[#F4C04A]" />
          <h2 className="font-display text-xl font-bold">Keep it free</h2>
          <p className="text-sm leading-relaxed text-muted">
            If you&apos;ve enjoyed using Statsfy, consider buying me a coffee as
            a token of appreciation.
          </p>
          <Button href={BUY_ME_A_COFFEE_URL} external variant="secondary" size="small">
            Buy me a coffee ↗
          </Button>
        </div>
      </aside>
    </div>
  );
}
