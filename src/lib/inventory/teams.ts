import type { Prisma, Team } from "@/generated/prisma/client";
import { NotFoundError } from "@/lib/inventory/errors";
import { teamContactInclude, teamSearchFilter } from "@/lib/inventory/utils";
import { prisma } from "@/lib/prisma";

type TeamWithContact = Prisma.TeamGetPayload<{
  include: typeof teamContactInclude;
}>;

export async function getAllTeams(): Promise<TeamWithContact[]> {
  return prisma.team.findMany({
    include: teamContactInclude,
    orderBy: { name: "asc" },
  });
}

export async function getTeamById(id: string): Promise<TeamWithContact> {
  const team = await prisma.team.findUnique({
    where: { id },
    include: teamContactInclude,
  });

  if (!team) {
    throw new NotFoundError("Team", id);
  }

  return team;
}

export async function findTeams(query: string): Promise<TeamWithContact[]> {
  return prisma.team.findMany({
    where: teamSearchFilter(query),
    include: teamContactInclude,
    orderBy: { name: "asc" },
  });
}

export async function createTeam(
  data: Prisma.TeamCreateInput,
): Promise<TeamWithContact> {
  return prisma.team.create({
    data,
    include: teamContactInclude,
  });
}

export async function createTeamWithContact(
  contactData: Prisma.ContactCreateInput,
  teamData: Omit<Prisma.TeamCreateInput, "contact">,
): Promise<TeamWithContact> {
  return prisma.$transaction(async (tx) => {
    const contact = await tx.contact.create({ data: contactData });

    return tx.team.create({
      data: {
        ...teamData,
        contact: { connect: { email: contact.email } },
      },
      include: teamContactInclude,
    });
  });
}

export async function updateTeam(
  id: string,
  data: Prisma.TeamUpdateInput,
): Promise<TeamWithContact> {
  try {
    return await prisma.team.update({
      where: { id },
      data,
      include: teamContactInclude,
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      throw new NotFoundError("Team", id);
    }
    throw error;
  }
}

export async function deleteTeam(id: string): Promise<void> {
  try {
    await prisma.team.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      throw new NotFoundError("Team", id);
    }
    throw error;
  }
}

export type { Team, TeamWithContact };
