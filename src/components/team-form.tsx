"use client";

import { useState } from "react";
import ContactForm from "@/components/contact-form";

export default function TeamForm() {
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  return (
    <div className="border border-background-warm rounded-md gap-1">
      <div className="flex flex-row items-center p-2 gap-3 border-b border-background-warm">
        {
          <input
            className="text-xl font-bold border border-background-warm px-1 rounded-sm w-full"
            type="text"
          />
        }
      </div>
      <ContactForm
        name={contactName}
        setName={setContactName}
        email={contactEmail}
        setEmail={setContactEmail}
      />
    </div>
  );
}
