"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";
import useTitle from "@/lib/useTitle";

function checkPassword(p) {
  if (p.length < 6) return "Password must be at least 6 characters long";
  if (!/[A-Z]/.test(p)) return "Password must have an uppercase letter";
  if (!/[a-z]/.test(p)) return "Password must have a lowercase letter";
  return "";
}

export default function Register() {
  useTitle("Register");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.target);
    const pwErr = checkPassword(f.get("password"));
    if (pwErr) {
      setError(pwErr);
      return toast.error(pwErr);
    }
    setBusy(true);
    const { error: err } = await signUp.email({
      name: f.get("name"),
      email: f.get("email"),
      password: f.get("password"),
    });
    setBusy(false);
    if (err) {
      const msg = err.message || "Registration failed";
      setError(msg);
      return toast.error(msg);
    }
    toast.success("Registration successful! Please login.");
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={onSubmit} className="card space-y-4 border border-base-300 bg-base-100 p-8 shadow-md">
        <h1 className="text-center text-3xl font-bold">Create an Account</h1>
        {error && <p className="text-sm text-error">{error}</p>}
        <input name="name" required placeholder="Name" className="input input-bordered w-full" />
        <input name="email" type="email" required placeholder="Email" className="input input-bordered w-full" />
        <input name="password" type="password" required placeholder="Password" className="input input-bordered w-full" />
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Registering..." : "Register"}
        </button>
        <div className="divider">OR</div>
        <button type="button" className="btn btn-outline" onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}>
          Continue with Google
        </button>
        <p className="text-center text-sm">
          Already have an account? <Link href="/login" className="link link-primary">Login</Link>
        </p>
      </form>
    </div>
  );
}