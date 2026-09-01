import type { Item, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type DatabaseClient = Prisma.TransactionClient | typeof prisma;

import type { ItemWithAvailable } from "@/lib/inventory/types";
import { LoanStatus } from "@/lib/inventory/types";

export const itemOwnerInclude = {
  owner: true,
} as const satisfies Prisma.ItemInclude;

export const teamContactInclude = {
  contact: true,
} as const satisfies Prisma.TeamInclude;

export const loanRelationsInclude = {
  team: { include: teamContactInclude },
  item: { include: itemOwnerInclude },
} as const satisfies Prisma.LoanInclude;

export function trimInput(value: string): string {
  return value.trim();
}

export function itemSearchFilter(query: string): Prisma.ItemWhereInput {
  const trimmed = trimInput(query);
  if (!trimmed) {
    return {};
  }

  return {
    OR: [
      { name: { contains: trimmed, mode: "insensitive" } },
      { mpn: { contains: trimmed, mode: "insensitive" } },
      { rsStockNumber: { contains: trimmed, mode: "insensitive" } },
    ],
  };
}

export function contactSearchFilter(query: string): Prisma.ContactWhereInput {
  const trimmed = trimInput(query);
  if (!trimmed) {
    return {};
  }

  return {
    OR: [
      { name: { contains: trimmed, mode: "insensitive" } },
      { email: { contains: trimmed, mode: "insensitive" } },
    ],
  };
}

export function teamSearchFilter(query: string): Prisma.TeamWhereInput {
  const trimmed = trimInput(query);
  if (!trimmed) {
    return {};
  }

  return {
    OR: [
      { name: { contains: trimmed, mode: "insensitive" } },
      { contact: { email: { contains: trimmed, mode: "insensitive" } } },
    ],
  };
}

export function loanStatusToWhere(status: LoanStatus): Prisma.LoanWhereInput {
  switch (status) {
    case LoanStatus.Active:
      return { returnedAt: null };
    case LoanStatus.Returned:
      return { returnedAt: { not: null } };
    default:
      return {};
  }
}

async function getLoanedQuantities(
  itemIds: string[],
  db: DatabaseClient = prisma,
): Promise<Map<string, number>> {
  if (itemIds.length === 0) {
    return new Map();
  }

  const aggregates = await db.loan.groupBy({
    by: ["itemId"],
    where: {
      itemId: { in: itemIds },
      returnedAt: null,
    },
    _sum: {
      quantity: true,
    },
  });

  const loanedByItemId = new Map<string, number>();
  for (const aggregate of aggregates) {
    loanedByItemId.set(aggregate.itemId, aggregate._sum.quantity ?? 0);
  }

  return loanedByItemId;
}

function attachAvailableToItem(
  item: Item,
  loanedByItemId: Map<string, number>,
): ItemWithAvailable {
  const loaned = loanedByItemId.get(item.id) ?? 0;
  return {
    ...item,
    available: item.quantity - loaned,
  };
}

export async function attachAvailable(
  items: Item[],
): Promise<ItemWithAvailable[]> {
  const loanedByItemId = await getLoanedQuantities(
    items.map((item) => item.id),
  );
  return items.map((item) => attachAvailableToItem(item, loanedByItemId));
}

export async function getAvailableQuantity(
  itemId: string,
  db: DatabaseClient = prisma,
): Promise<number> {
  const item = await db.item.findUnique({
    where: { id: itemId },
    select: { quantity: true },
  });

  if (!item) {
    return 0;
  }

  const loanedByItemId = await getLoanedQuantities([itemId], db);
  const loaned = loanedByItemId.get(itemId) ?? 0;
  return item.quantity - loaned;
}
