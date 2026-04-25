import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-6xl font-bold text-text-muted font-mono">404</h1>
      <p className="mt-4 text-text-secondary">Page not found.</p>
      <Link
        href="/"
        className="mt-6 text-sm text-accent underline underline-offset-2"
      >
        Back to home
      </Link>
    </div>
  );
}
