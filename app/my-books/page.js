"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";
import useTitle from "@/lib/useTitle";
import PrivateRoute from "@/components/PrivateRoute";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";

const CATS = ["Fiction", "Science", "History", "Kids", "Others"];

function MyBooks() {
  useTitle("My Books");
  const [books, setBooks] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/books?mine=true", { auth: true })
      .then(setBooks)
      .catch((e) => {
        toast.error(e.message);
        setBooks([]);
      });
  }, []);

  async function saveEdit(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    setBusy(true);
    try {
      const file = f.get("image");
      const body = {
        title: f.get("title"),
        author: f.get("author"),
        category: f.get("category"),
        description: f.get("description"),
        totalCopies: f.get("totalCopies"),
      };
      if (file && file.size) body.image = await uploadImage(file);
      const updated = await api(`/books/${editing._id}`, { method: "PATCH", auth: true, body });
      setBooks((list) => list.map((b) => (b._id === updated._id ? updated : b)));
      toast.success("Book updated successfully!");
      setEditing(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await api(`/books/${deleting._id}`, { method: "DELETE", auth: true });
      setBooks((list) => list.filter((b) => b._id !== deleting._id));
      toast.success("Book deleted");
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!books) return <Spinner />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-center text-3xl font-bold">My Books</h1>
      {books.length === 0 ? (
        <p className="text-center opacity-70">
          You have not added any books yet. <Link href="/add-book" className="link link-primary">Add one now</Link>
        </p>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Copies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b._id}>
                  <td>
                    <img src={b.image} alt={b.title} className="h-16 w-12 rounded object-cover" />
                  </td>
                  <td>
                    <p className="font-semibold">{b.title}</p>
                    <p className="text-xs opacity-70">{b.author}</p>
                  </td>
                  <td>{b.category}</td>
                  <td>
                    {b.copies}/{b.totalCopies}
                  </td>
                  <td className="space-x-2">
                    <button className="btn btn-sm btn-primary" onClick={() => setEditing(b)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-error" onClick={() => setDeleting(b)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title="Edit Book" onClose={() => setEditing(null)}>
          <form onSubmit={saveEdit} className="space-y-3">
            <input name="title" defaultValue={editing.title} required className="input input-bordered w-full" />
            <input name="author" defaultValue={editing.author} required className="input input-bordered w-full" />
            <select name="category" defaultValue={editing.category} className="select select-bordered w-full">
              {CATS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input name="totalCopies" type="number" min="1" defaultValue={editing.totalCopies} required className="input input-bordered w-full" />
            <label className="block text-sm">
              Change image (optional)
              <input name="image" type="file" accept="image/*" className="file-input file-input-bordered mt-1 w-full" />
            </label>
            <textarea name="description" defaultValue={editing.description} required rows={4} className="textarea textarea-bordered w-full" />
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={busy}>
                {busy ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete this book?" onClose={() => setDeleting(null)}>
          <p>"{deleting.title}" will be removed permanently. This cannot be undone.</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setDeleting(null)}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={confirmDelete} disabled={busy}>
              {busy ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <PrivateRoute>
      <MyBooks />
    </PrivateRoute>
  );
}
