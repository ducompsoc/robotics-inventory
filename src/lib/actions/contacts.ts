"use server";

import { revalidatePath } from "next/cache";
import { toggleContactIdHeld } from "@/lib/inventory";

export async function toggleContactIdHeldAction(email: string) {
  await toggleContactIdHeld(email);
  revalidatePath("/");
}
