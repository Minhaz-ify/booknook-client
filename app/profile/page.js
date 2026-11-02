"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadImage } from "@/lib/imgbb";
import useTitle from "@/lib/useTitle";
import PrivateRoute from "@/components/PrivateRoute";

function Profile() {
  useTitle("My Profile");
  const { data: session } = useSession();
  const u = session.user;
  const [name, setName] = useState(u.name || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);

  const avatar =
    preview || u.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(u.name)}`;

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    setBusy(true);
    try {
      const data = { name: name.trim() };
      if (file) data.image = await uploadImage(file);
      const { error } = await authClient.updateUser(data);
      if (error) throw new Error(error.message || "Could not update profile");
      toast.success("Profile updated successfully!");
      setFile(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={onSubmit} className="card items-center space-y-4 border border-base-300 bg-base-100 p-8 shadow-md">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="avatar">
          <div className="w-28 rounded-full">
            <img src={avatar} alt={u.name} />
          </div>
        </div>
        <label className="w-full text-sm">
          Change photo
          <input type="file" accept="image/*" onChange={onFile} className="file-input file-input-bordered mt-1 w-full" />
        </label>
        <label className="w-full text-sm">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required className="input input-bordered mt-1 w-full" />
        </label>
        <label className="w-full text-sm">
          Email
          <input value={u.email} readOnly className="input input-bordered mt-1 w-full opacity-70" />
        </label>
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  );
}