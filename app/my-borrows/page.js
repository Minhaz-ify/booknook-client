"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import useTitle from "@/lib/useTitle";
import PrivateRoute from "@/components/PrivateRoute";
import Spinner from "@/components/Spinner";

const fmt = (d) => new Date(d).toLocaleDateString();

function MyBorrows() {
  useTitle("My Borrows");
  const [list, setList] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    api("/borrows", { auth: true })
      .then(setList)
      .catch((e) => {
        toast.error(e.message);
        setList([]);
      });
  }, []);

  async function giveBack(id) {
    setBusyId(id);
    try {
      await api(`/borrows/${id}`, { method: "DELETE", auth: true });
      setList((l) => l.filter((x) => x._id !== id));
      toast.success("Book returned. Thank you!");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
    }
  }

  if (!list) return <Spinner />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-6 text-center text-3xl font-bold">My Borrows</h1>
      {list.length === 0 ? (
        <p className="text-center opacity-70">
          You have not borrowed anything yet. <Link href="/books" className="link link-primary">Browse books</Link>
        </p>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b._id}>
                  <td>
                    <img src={b.bookImage} alt={b.bookTitle} className="h-16 w-12 rounded object-cover" />
                  </td>
                  <td className="font-semibold">{b.bookTitle}</td>
                  <td>{fmt(b.borrowDate)}</td>
                  <td>{fmt(b.returnDate)}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" disabled={busyId === b._id} onClick={() => giveBack(b._id)}>
                      {busyId === b._id ? "Returning..." : "Return Book"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <PrivateRoute>
      <MyBorrows />
    </PrivateRoute>
  );
}
