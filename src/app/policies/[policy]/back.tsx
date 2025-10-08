"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Back() {
  const router = useRouter();
  return (
    <button className="text-lg font-medium text-muted-foreground mb-2 hover:text-foreground flex items-center gap-2 hover:cursor-pointer" onClick={() => router.back()}>
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Policies
    </button>
  );
}