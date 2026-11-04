"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import useTitle from "@/lib/useTitle";
import BookCard from "@/components/BookCard";
import Spinner from "@/components/Spinner";
import HeroSlider from "@/components/HeroSlider";

const steps = [
  { n: "1", t: "Create an account", d: "Register with email or Google in under a minute." },
  { n: "2", t: "Find your book", d: "Browse every title and open the details page." },
  { n: "3", t: "Borrow and return", d: "Confirm the borrow, read, then return it from My Borrows." },
];

const categories = [
  { n: "Fiction", i: "🧙" },
  { n: "Science", i: "🔬" },
  { n: "History", i: "🏛️" },
  { n: "Kids", i: "🧸" },
  { n: "Others", i: "📖" },
];

export default function Home() {
  useTitle("Home");
  const [books, setBooks] = useState(null);

  useEffect(() => {
    api("/books?limit=6")
      .then(setBooks)
      .catch((e) => {
        toast.error(e.message);
        setBooks([]);
      });
  }, []);

  return (
    <div>
      <HeroSlider />

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-8 text-center text-3xl font-bold">New Arrivals</h2>
        {books === null ? (
          <Spinner full={false} />
        ) : books.length === 0 ? (
          <p className="text-center opacity-70">No books yet. Be the first to add one!</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link href="/books" className="btn btn-primary">
            See All Books
          </Link>
        </div>
      </section>

      <section className="bg-base-100 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">How Borrowing Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="card border border-base-300 bg-base-200 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-content">
                  {s.n}
                </div>
                <h3 className="text-lg font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm opacity-80">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-8 text-center text-3xl font-bold">Top Categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {categories.map((c) => (
            <Link key={c.n} href="/books" className="card items-center border border-base-300 bg-base-100 p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-4xl">{c.i}</span>
              <span className="mt-2 font-semibold">{c.n}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}