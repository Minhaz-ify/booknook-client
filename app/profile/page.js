"use client";
import { useSession } from "@/lib/auth-client";
import useTitle from "@/lib/useTitle";
import PrivateRoute from "@/components/PrivateRoute";

function Profile() {
  useTitle("My Profile");
  const { data: session } = useSession();
  const u = session.user;
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card items-center border border-base-300 bg-base-100 p-8 text-center shadow-md">
        <div className="avatar">
          <div className="w-28 rounded-full">
            <img src={u.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(u.name)}`} alt={u.name} />
          </div>
        </div>
        <h1 className="mt-4 text-2xl font-bold">{u.name}</h1>
        <p className="opacity-80">{u.email}</p>
      </div>
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
