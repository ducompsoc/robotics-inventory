import Contact from "@/components/contact";
import { getAllTeams } from "@/lib/inventory";

export default async function TeamList() {
  const teams = await getAllTeams();

  return (
    <div className="flex flex-col gap-5 w-xs">
      {teams.map((team) => (
        <div
          className="border border-background-warm rounded-md gap-1"
          key={team.id}
        >
          <div className="flex flex-row items-center p-2 gap-3 border-b border-background-warm">
            <div className="text-xl font-bold">{team.name}</div>
            <div className="opacity-75">{team.id}</div>
          </div>
          <Contact {...team.contact} />
        </div>
      ))}
    </div>
  );
}
