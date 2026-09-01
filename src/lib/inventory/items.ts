import type { Prisma } from "@/generated/prisma/client";
import { NotFoundError } from "@/lib/inventory/errors";
import type { ItemWithAvailable } from "@/lib/inventory/types";
import {
  attachAvailable,
  itemOwnerInclude,
  itemSearchFilter,
} from "@/lib/inventory/utils";
import { prisma } from "@/lib/prisma";

export async function getAllItems(): Promise<ItemWithAvailable[]> {
  const items = await prisma.item.findMany({
    include: itemOwnerInclude,
    orderBy: { name: "asc" },
  });

  return attachAvailable(items);
}

export async function getItemById(id: string): Promise<ItemWithAvailable> {
  const item = await prisma.item.findUnique({
    where: { id },
    include: itemOwnerInclude,
  });

  if (!item) {
    throw new NotFoundError("Item", id);
  }

  const [withAvailable] = await attachAvailable([item]);
  return withAvailable;
}

export async function findItems(query: string): Promise<ItemWithAvailable[]> {
  const items = await prisma.item.findMany({
    where: itemSearchFilter(query),
    include: itemOwnerInclude,
    orderBy: { name: "asc" },
  });

  return attachAvailable(items);
}

export async function createItem(
  data: Prisma.ItemCreateInput,
): Promise<ItemWithAvailable> {
  const item = await prisma.item.create({
    data,
    include: itemOwnerInclude,
  });

  const [withAvailable] = await attachAvailable([item]);
  return withAvailable;
}

export async function updateItem(
  id: string,
  data: Prisma.ItemUpdateInput,
): Promise<ItemWithAvailable> {
  try {
    const item = await prisma.item.update({
      where: { id },
      data,
      include: itemOwnerInclude,
    });

    const [withAvailable] = await attachAvailable([item]);
    return withAvailable;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      throw new NotFoundError("Item", id);
    }
    throw error;
  }
}

export async function deleteItem(id: string): Promise<void> {
  try {
    await prisma.item.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      throw new NotFoundError("Item", id);
    }
    throw error;
  }
}
