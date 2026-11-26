import { Link } from "react-router";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <img src="/favicon.svg" alt="" width={28} height={28} />
      <span>JobFlow</span>
    </Link>
  );
}
