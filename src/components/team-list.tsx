import { getAllTeams } from "@/lib/inventory";

function Contact(contact: { email: string; idHeld: boolean; name: string }) {
  return (
    <div className="flex flex-col text-sm p-2">
      <div className="font-bold">{contact.name}</div>
      <div>{contact.email}</div>
      <div>ID held: {contact.idHeld.toString()}</div>
    </div>
  );
}

export default async function TeamList() {
  const teams = await getAllTeams();

  return (
    <div className="flex flex-col gap-5 w-xs">
      {teams.map((team) => (
        <div
          className="border border-background-warm rounded-md gap-1 p-2"
          key={team.id}
        >
          <div className="flex flex-row items-center gap-3">
            <div className="text-xl font-bold">{team.name}</div>
            <div className="opacity-75">{team.id}</div>
          </div>
          <Contact {...team.contact} />
        </div>
      ))}
    </div>
  );
}
