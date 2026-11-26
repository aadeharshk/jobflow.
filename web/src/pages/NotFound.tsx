import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-sm font-medium text-brand">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link to="/" className="text-sm text-brand hover:underline">
        Back to home
      </Link>
    </div>
  );
}
