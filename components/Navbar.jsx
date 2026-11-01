"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [theme, setTheme] = useState("retro");

  useEffect(() => {
    const t = localStorage.getItem("theme") || "retro";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const toggleTheme = () => {
    const t = theme === "retro" ? "dim" : "retro";
    setTheme(t);
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/books", label: "All Books" },
    ...(session
      ? [
          { href: "/add-book", label: "Add Book" },
          { href: "/my-books", label: "My Books" },
          { href: "/my-borrows", label: "My Borrows" },
        ]
      : []),
  ];

  const handleLogout = async () => {
    await signOut();
    window.location.assign("/");
  };

  const items = links.map((l) => (
    <li key={l.href}>
      <Link href={l.href} className={pathname === l.href ? "bg-primary text-primary-content" : ""}>
        {l.label}
      </Link>
    </li>
  ));

  return (
    <div className="navbar sticky top-0 z-40 bg-base-100 px-4 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
            {items}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-bold">
          📚 BookNook
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">{items}</ul>
      </div>
      <div className="navbar-end gap-2">
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle" aria-label="Toggle theme">
          {theme === "retro" ? "🌙" : "☀️"}
        </button>
        {isPending ? null : session ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={session.user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(session.user.name)}`}
                  alt={session.user.name}
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-56 rounded-box bg-base-100 p-2 shadow">
              <li className="menu-title">{session.user.name}</li>
              <li>
                <Link href="/profile">My Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link href="/login" className="btn btn-outline btn-primary btn-sm sm:btn-md">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm sm:btn-md">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}