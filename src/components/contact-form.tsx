"use client";

export default function ContactForm({ name, setName, email, setEmail }) {
  return (
    <div className="flex flex-col text-sm gap-1 p-2">
      <div className="flex items-center gap-1 font-bold text-left cursor-pointer disabled:opacity-50">
        <input
          className="border border-background-warm px-1 rounded-sm w-full"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <input
        className="border border-background-warm px-1 rounded-sm w-full"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  );
}
