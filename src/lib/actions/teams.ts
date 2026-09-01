"use server";

import { revalidatePath } from "next/cache";
import { createTeamWithContact } from "@/lib/inventory";
import { trimInput } from "@/lib/inventory/utils";

type CreateTeamInput = {
  teamName: string;
  contactName: string;
  contactEmail: string;
};

export async function createTeamWithContactAction({
  teamName,
  contactName,
  contactEmail,
}: CreateTeamInput) {
  const trimmedTeamName = trimInput(teamName);
  const trimmedContactName = trimInput(contactName);
  const trimmedContactEmail = trimInput(contactEmail);

  await createTeamWithContact(
    {
      email: trimmedContactEmail,
      name: trimmedContactName,
      idHeld: true,
    },
    {
      name: trimmedTeamName || undefined,
    },
  );

  revalidatePath("/");
}
