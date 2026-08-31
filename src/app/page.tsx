import { signOutEverywhere } from "@/app/actions";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="p-8">
      <h1>Robotics Inventory</h1>
      <p>Signed in as {session?.user?.name ?? session?.user?.email}</p>
      <p>
        <a href="/items">View items</a>
      </p>
      <form action={signOutEverywhere}>
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
