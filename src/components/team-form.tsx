"use client";

import { Check } from "lucide-react";
import { type ComponentProps, useState, useTransition } from "react";
import ContactForm from "@/components/contact-form";
import { createTeamWithContactAction } from "@/lib/actions/teams";

export default function TeamForm() {
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = (
    event,
  ) => {
    event.preventDefault();

    if (!contactName.trim() || !contactEmail.trim()) {
      return;
    }

    startTransition(async () => {
      await createTeamWithContactAction({
        teamName: name,
        contactName,
        contactEmail,
      });

      setName("");
      setContactName("");
      setContactEmail("");
    });
  };

  return (
    <form
      className="border border-background-warm rounded-md gap-1"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-row items-center p-2 gap-3 border-b border-background-warm">
        <input
          className="text-xl font-bold w-full min-w-0"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Team name"
          disabled={isPending}
        />
        <button
          type="submit"
          className="shrink-0 rounded-sm border border-contrast p-1 text-contrast disabled:opacity-50"
          disabled={isPending}
          aria-label="Add team"
        >
          <Check className="h-4 w-4" />
        </button>
      </div>
      <ContactForm
        name={contactName}
        setName={setContactName}
        email={contactEmail}
        setEmail={setContactEmail}
        disabled={isPending}
      />
    </form>
  );
}
