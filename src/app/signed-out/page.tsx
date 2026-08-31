import Link from "next/link";

export default function SignedOut() {
  return (
    <main className="p-8">
      <h1>Signed out</h1>
      <p>You have been signed out of Robotics Inventory and Keycloak.</p>
      <Link href="/">Sign in again</Link>
    </main>
  );
}
