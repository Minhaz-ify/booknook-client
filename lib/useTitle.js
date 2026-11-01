"use client";
import { useEffect } from "react";
export default function useTitle(title) {
  useEffect(() => {
    document.title = `BookNook | ${title}`;
  }, [title]);
}
