"use client";

type ContactFormProps = {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  disabled?: boolean;
};

export default function ContactForm({
  name,
  setName,
  email,
  setEmail,
  disabled = false,
}: ContactFormProps) {
  return (
    <div className="flex flex-col text-sm gap-1 p-2">
      <div className="flex items-center gap-1 font-bold text-left">
        <input
          className="w-full"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Contact name"
          disabled={disabled}
        />
      </div>
      <input
        className="w-full"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Contact email"
        disabled={disabled}
      />
    </div>
  );
}
