"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Back() {
  const router = useRouter();
  return (
    <button
      className="mb-2 flex items-center gap-2 text-sm font-medium tracking-tight text-muted-foreground transition-colors hover:cursor-pointer hover:text-primary"
      onClick={() => router.back()}
    >
      <ArrowLeftIcon className="w-4 h-4" />
      Back to Policies
    </button>
  );
}
