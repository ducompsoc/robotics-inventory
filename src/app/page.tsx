import { auth, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="p-8">
      <h1>Robotics Inventory</h1>
      <p>Signed in as {session?.user?.name ?? session?.user?.email}</p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
