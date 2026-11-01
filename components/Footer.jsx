"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="bg-base-300 text-base-content">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold">📚 BookNook</p>
          <p className="mt-2 text-sm opacity-80">
            A small online library where you can add a book, borrow a book and return it when you are done.
          </p>
        </div>
        <div>
          <p className="mb-2 font-semibold">Contact</p>
          <p className="text-sm opacity-80">minhajabc23@gmail.com.app</p>
          <p className="text-sm opacity-80">+880 1885-221084</p>
          <p className="text-sm opacity-80">Chattogram, Bangladesh</p>
        </div>
        <div>
          <p className="mb-2 font-semibold">Follow us</p>
          <div className="flex items-center gap-4">
            <Link href="https://x.com" target="_blank" aria-label="X" className="hover:text-primary">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link href="https://facebook.com" target="_blank" className="text-sm hover:text-primary">
              Facebook
            </Link>
            <Link href="https://github.com" target="_blank" className="text-sm hover:text-primary">
              GitHub
            </Link>
          </div>
        </div>
      </div>
      <p className="border-t border-base-content/10 py-4 text-center text-sm opacity-70">
        © {year} BookNook. All rights reserved.
      </p>
    </footer>
  );
}