"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import useTitle from "@/lib/useTitle";
import BookCard from "@/components/BookCard";
import Spinner from "@/components/Spinner";

const cats = ["All", "Fiction", "Science", "History", "Kids", "Others"];

export default function AllBooks() {
  useTitle("All Books");
  const [books, setBooks] = useState(null);
  const [cat, setCat] = useState("All");

  useEffect(() => {
    api("/books")
      .then(setBooks)
      .catch((e) => {
        toast.error(e.message);
        setBooks([]);
      });
  }, []);

  const shown = books ? books.filter((b) => cat === "All" || b.category === cat) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-6 text-center text-3xl font-bold">All Books</h1>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`btn btn-sm ${cat === c ? "btn-primary" : "btn-outline"}`}>
            {c}
          </button>
        ))}
      </div>
      {books === null ? (
        <Spinner />
      ) : shown.length === 0 ? (
        <p className="text-center opacity-70">No books found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
