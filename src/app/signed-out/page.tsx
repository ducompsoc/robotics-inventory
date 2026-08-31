import Link from "next/link";

export default function SignedOut() {
  return (
    <main className="p-10 flex-1 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center text-center gap-5 border border-background-warm rounded-xl px-5 py-10 w-sm text-balance">
        <h1 className="text-2xl">Signed out</h1>
        <p>You have been signed out of Robotics Inventory.</p>
        <Link className="underline" href="/">
          Sign in again
        </Link>
      </div>
    </main>
  );
}
