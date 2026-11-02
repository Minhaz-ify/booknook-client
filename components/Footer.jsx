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
          <p className="text-sm opacity-80">minhajabc23@gmail.com</p>
          <p className="text-sm opacity-80">+880 1885-221084</p>
          <p className="text-sm opacity-80">Chattogram, Bangladesh</p>
        </div>
        <div>
          <p className="mb-2 font-semibold">Follow us</p>
          <div className="flex items-center gap-4">
            <Link
              href="https://www.linkedin.com/in/minhazify"
              target="_blank"
              aria-label="LinkedIn"
              className="hover:text-primary"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
            <Link
              href="https://www.facebook.com/profile.php?id=61594907191632"
              target="_blank"
              className="text-sm hover:text-primary"
            >
              Facebook
            </Link>
            <Link
              href="https://github.com/Minhaz-ify"
              target="_blank"
              className="text-sm hover:text-primary"
            >
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