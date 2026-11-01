"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";
import { useSession } from "@/lib/auth-client";
import useTitle from "@/lib/useTitle";
import PrivateRoute from "@/components/PrivateRoute";

const CATS = ["Fiction", "Science", "History", "Kids", "Others"];

function Form() {
  useTitle("Add Book");
  const { data: session } = useSession();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    const file = f.get("image");
    if (!file || !file.size) return toast.error("Please choose a book image");
    setBusy(true);
    try {
      const image = await uploadImage(file);
      await api("/books", {
        method: "POST",
        auth: true,
        body: {
          title: f.get("title"),
          author: f.get("author"),
          category: f.get("category"),
          description: f.get("description"),
          totalCopies: f.get("totalCopies"),
          image,
        },
      });
      toast.success("Book added successfully!");
      router.push("/my-books");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-center text-3xl font-bold">Add a New Book</h1>
      <form onSubmit={onSubmit} className="card space-y-4 border border-base-300 bg-base-100 p-6 shadow-md">
        <input name="title" required placeholder="Book title" className="input input-bordered w-full" />
        <input name="author" required placeholder="Author name" className="input input-bordered w-full" />
        <select name="category" required defaultValue="" className="select select-bordered w-full">
          <option value="" disabled>
            Select category
          </option>
          {CATS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input name="totalCopies" type="number" min="1" defaultValue="1" required placeholder="Total copies" className="input input-bordered w-full" />
        <input name="image" type="file" accept="image/*" required className="file-input file-input-bordered w-full" />
        <textarea name="description" required rows={4} placeholder="Short description" className="textarea textarea-bordered w-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={session.user.name} readOnly className="input input-bordered w-full" />
          <input value={session.user.email} readOnly className="input input-bordered w-full" />
        </div>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <PrivateRoute>
      <Form />
    </PrivateRoute>
  );
}
