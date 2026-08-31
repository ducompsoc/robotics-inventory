import { signOutEverywhere } from "@/app/actions";

export default async function Home() {
  return (
    <main className="p-10">
      <p>Signed in as</p>
      <form action={signOutEverywhere}>
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
