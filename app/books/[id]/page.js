"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import useTitle from "@/lib/useTitle";
import PrivateRoute from "@/components/PrivateRoute";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";

const dayStr = (add) => {
  const d = new Date();
  d.setDate(d.getDate() + add);
  return d.toISOString().slice(0, 10);
};

function Details() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [book, setBook] = useState(null);
  const [missing, setMissing] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  useTitle(book ? book.title : "Book Details");

  useEffect(() => {
    api(`/books/${id}`, { auth: true })
      .then(setBook)
      .catch((e) => {
        toast.error(e.message);
        setMissing(true);
      });
  }, [id]);

  async function confirmBorrow(e) {
    e.preventDefault();
    const returnDate = new FormData(e.target).get("returnDate");
    setBusy(true);
    try {
      await api("/borrows", { method: "POST", auth: true, body: { bookId: id, returnDate } });
      setBook((b) => ({ ...b, copies: b.copies - 1 }));
      toast.success("Book borrowed successfully!");
      setOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (missing) return <p className="py-20 text-center">This book could not be loaded.</p>;
  if (!book) return <Spinner />;
  const available = book.copies > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="card gap-6 border border-base-300 bg-base-100 p-6 shadow-md md:flex-row">
        <img src={book.image} alt={book.title} className="h-96 w-full rounded-lg object-cover md:w-72" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="mt-1 opacity-80">by {book.author}</p>
          <div className="my-3 flex flex-wrap gap-2">
            <span className="badge badge-primary">{book.category}</span>
            <span className={`badge ${available ? "badge-success" : "badge-error"}`}>
              {available ? `${book.copies} of ${book.totalCopies} copies available` : "No copies left"}
            </span>
          </div>
          <p className="leading-relaxed">{book.description}</p>
          <p className="mt-4 text-sm opacity-70">
            Added by {book.addedByName} ({book.addedByEmail}) on {new Date(book.createdAt).toLocaleDateString()}
          </p>
          <button className="btn btn-primary mt-6" disabled={!available} onClick={() => setOpen(true)}>
            {available ? "Borrow This Book" : "Not Available"}
          </button>
        </div>
      </div>

      {open && (
        <Modal title={`Borrow "${book.title}"`} onClose={() => setOpen(false)}>
          <form onSubmit={confirmBorrow} className="space-y-3">
            <label className="form-control w-full">
              <span className="label-text mb-1">Name</span>
              <input className="input input-bordered w-full" value={session.user.name} readOnly />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1">Email</span>
              <input className="input input-bordered w-full" value={session.user.email} readOnly />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1">Return date</span>
              <input type="date" name="returnDate" required min={dayStr(1)} defaultValue={dayStr(7)} className="input input-bordered w-full" />
            </label>
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={busy}>
                {busy ? "Saving..." : "Confirm Borrow"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <PrivateRoute>
      <Details />
    </PrivateRoute>
  );
}
