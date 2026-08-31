"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function toNullableString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export async function createItem(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const name = toNullableString(formData.get("name"));
  if (!name) throw new Error("Name is required");

  const quantity = Number.parseInt(String(formData.get("quantity")), 10);
  if (Number.isNaN(quantity)) throw new Error("Quantity is required");

  await prisma.item.create({
    data: {
      name,
      quantity,
      imageUrl: toNullableString(formData.get("imageUrl")),
      rsStockNumber: toNullableString(formData.get("rsStockNumber")),
      mpn: toNullableString(formData.get("mpn")),
      ownerEmail: toNullableString(formData.get("ownerEmail")),
    },
  });

  revalidatePath("/items");
}

export async function deleteItem(itemId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.item.delete({ where: { id: itemId } });

  revalidatePath("/items");
}
