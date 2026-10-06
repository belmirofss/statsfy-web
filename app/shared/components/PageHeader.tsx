import { ReactNode } from "react";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
};

export const PageHeader = ({ title, subtitle, actions }: Props) => {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:mb-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="font-display text-[26px] font-bold tracking-[-0.02em] lg:text-[32px]">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-[15px] text-muted">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </div>
  );
};
