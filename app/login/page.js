"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import useTitle from "@/lib/useTitle";

const dest = () => {
  const r = new URLSearchParams(window.location.search).get("redirect");
  return r && r.startsWith("/") && !r.startsWith("//") ? r : "/";
};

export default function Login() {
  useTitle("Login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.target);
    setBusy(true);
    const { error: err } = await signIn.email({ email: f.get("email"), password: f.get("password") });
    if (err) {
      setBusy(false);
      const msg = err.message || "Invalid email or password";
      setError(msg);
      return toast.error(msg);
    }
    // full reload so the Navbar picks up the new session
    window.location.assign(dest());
  }

  async function googleLogin() {
    const { error: err } = await signIn.social({ provider: "google", callbackURL: dest() });
    if (err) toast.error(`Google: ${err.message || err.statusText || err.status || "sign-in failed"}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={onSubmit} className="card space-y-4 border border-base-300 bg-base-100 p-8 shadow-md">
        <h1 className="text-center text-3xl font-bold">Login</h1>
        {error && <p className="text-sm text-error">{error}</p>}
        <input name="email" type="email" required placeholder="Email" className="input input-bordered w-full" />
        <input name="password" type="password" required placeholder="Password" className="input input-bordered w-full" />
        <button type="button" className="link link-hover self-start text-sm" onClick={() => toast("Password reset is not available yet")}>
          Forget Password?
        </button>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Logging in..." : "Login"}
        </button>
        <div className="divider">OR</div>
        <button type="button" className="btn btn-outline" onClick={googleLogin}>
          Continue with Google
        </button>
        <p className="text-center text-sm">
          New to BookNook? <Link href="/register" className="link link-primary">Register</Link>
        </p>
      </form>
    </div>
  );
}