"use client";

import { IdCard } from "lucide-react";
import { useTransition } from "react";
import { toggleContactIdHeldAction } from "@/lib/actions/contacts";

type ContactProps = {
  email: string;
  idHeld: boolean;
  name: string;
};

export default function Contact({ email, idHeld, name }: ContactProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggleIdHeld() {
    startTransition(async () => {
      await toggleContactIdHeldAction(email);
    });
  }

  return (
    <div className="flex flex-col text-sm p-2">
      <button
        type="button"
        className={`flex items-center gap-1 font-bold text-left cursor-pointer ${
          isPending ? "cursor-wait" : ""
        }`}
        disabled={isPending}
        onClick={handleToggleIdHeld}
      >
        <span>{name}</span>
        {idHeld ? <IdCard className="h-lh w-lh text-contrast" /> : null}
      </button>
      <div>{email}</div>
    </div>
  );
}
