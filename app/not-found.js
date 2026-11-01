import Link from "next/link";

export const metadata = { title: "BookNook | Page Not Found" };

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="mt-2 text-2xl font-semibold">This page wandered off the shelf</h1>
      <p className="mt-2 opacity-70">The page you are looking for does not exist.</p>
      <Link href="/" className="btn btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
