"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Spinner from "./Spinner";

export default function PrivateRoute({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!isPending && !session) router.replace(`/login?redirect=${encodeURIComponent(path)}`);
  }, [isPending, session, path, router]);

  if (isPending || !session) return <Spinner />;
  return children;
}
