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
        className={`font-bold text-left cursor-pointer disabled:cursor-wait disabled:opacity-50 ${
          isPending ? "opacity-50 cursor-wait" : ""
        }`}
        disabled={isPending}
        onClick={handleToggleIdHeld}
      >
        {name}{" "}
        {idHeld ? <IdCard className="inline-block h-lh text-contrast" /> : null}
      </button>
      <div>{email}</div>
    </div>
  );
}
