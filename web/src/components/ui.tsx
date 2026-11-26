import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

type Variant = "primary" | "secondary" | "ghost" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-fg hover:opacity-90 shadow-sm",
  secondary: "bg-surface text-fg border border-border hover:bg-surface-2",
  ghost: "text-fg hover:bg-surface-2",
  danger: "bg-danger text-white hover:opacity-90",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" | "lg" }
>(({ variant = "primary", size = "md", className, ...props }, ref) => (
  <button
    ref={ref}
    className={cx(
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
      size === "sm" && "h-8 px-3 text-sm",
      size === "md" && "h-10 px-4 text-sm",
      size === "lg" && "h-12 px-6 text-base",
      variants[variant],
      className,
    )}
    {...props}
  />
));
Button.displayName = "Button";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("rounded-card border border-border bg-surface p-6 shadow-sm", className)} {...props} />;
}

export function CardHeader({ title, description, action }: { title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const inputId = id ?? `in-${label.toLowerCase().replace(/\W+/g, "-")}`;
    return (
      <div className={className}>
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={hint || error ? `${inputId}-desc` : undefined}
          className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm placeholder:text-muted focus:border-brand"
          {...props}
        />
        {(hint || error) && (
          <p id={`${inputId}-desc`} className={cx("mt-1 text-xs", error ? "text-danger" : "text-muted")}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "brand" | "success" | "warning"; children: ReactNode }) {
  const tones = {
    neutral: "bg-surface-2 text-muted",
    brand: "bg-brand-soft text-brand",
    success: "bg-surface-2 text-success",
    warning: "bg-surface-2 text-warning",
  };
  return <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-sm text-muted">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx("relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition", checked ? "bg-brand" : "bg-border")}
      >
        <span
          className={cx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")}
        />
      </button>
    </label>
  );
}

export function EmptyState({ icon, title, children, action }: { icon: ReactNode; title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-border px-6 py-12 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand" aria-hidden>
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted">{children}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-2 text-sm text-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-brand" aria-hidden />
      {label}…
    </div>
  );
}

export function Alert({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  const tones = {
    info: "border-border bg-surface-2",
    error: "border-danger/40 bg-surface-2 text-danger",
    success: "border-success/40 bg-surface-2 text-success",
  };
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cx("rounded-lg border px-4 py-3 text-sm", tones[tone])}>
      {children}
    </div>
  );
}

export { cx };
