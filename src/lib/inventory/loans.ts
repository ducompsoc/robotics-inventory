import type { Loan, Prisma } from "@/generated/prisma/client";
import { InsufficientStockError, NotFoundError } from "@/lib/inventory/errors";
import {
  type LoanFilter,
  type LoanRequest,
  LoanStatus,
} from "@/lib/inventory/types";
import {
  getAvailableQuantity,
  loanRelationsInclude,
  loanStatusToWhere,
} from "@/lib/inventory/utils";
import { prisma } from "@/lib/prisma";

type LoanWithRelations = Prisma.LoanGetPayload<{
  include: typeof loanRelationsInclude;
}>;

function buildLoanWhere(filter?: LoanFilter): Prisma.LoanWhereInput {
  const status = filter?.status ?? LoanStatus.All;

  return {
    ...(filter?.teamId ? { teamId: filter.teamId } : {}),
    ...(filter?.itemId ? { itemId: filter.itemId } : {}),
    ...loanStatusToWhere(status),
  };
}

export async function getLoans(
  filter?: LoanFilter,
): Promise<LoanWithRelations[]> {
  return prisma.loan.findMany({
    where: buildLoanWhere(filter),
    include: loanRelationsInclude,
    orderBy: { loanedAt: "desc" },
  });
}

export async function getAllLoans(): Promise<LoanWithRelations[]> {
  return getLoans();
}

export async function getAllActiveLoans(): Promise<LoanWithRelations[]> {
  return getLoans({ status: LoanStatus.Active });
}

export async function getAllReturnedLoans(): Promise<LoanWithRelations[]> {
  return getLoans({ status: LoanStatus.Returned });
}

export async function getAllLoansByTeam(
  teamId: string,
): Promise<LoanWithRelations[]> {
  return getLoans({ teamId });
}

export async function getAllActiveLoansByTeam(
  teamId: string,
): Promise<LoanWithRelations[]> {
  return getLoans({ teamId, status: LoanStatus.Active });
}

export async function getAllReturnedLoansByTeam(
  teamId: string,
): Promise<LoanWithRelations[]> {
  return getLoans({ teamId, status: LoanStatus.Returned });
}

export async function getAllLoansByItem(
  itemId: string,
): Promise<LoanWithRelations[]> {
  return getLoans({ itemId });
}

export async function getAllActiveLoansByItem(
  itemId: string,
): Promise<LoanWithRelations[]> {
  return getLoans({ itemId, status: LoanStatus.Active });
}

export async function getAllReturnedLoansByItem(
  itemId: string,
): Promise<LoanWithRelations[]> {
  return getLoans({ itemId, status: LoanStatus.Returned });
}

export async function createLoans(
  teamId: string,
  requests: LoanRequest[],
): Promise<Loan[]> {
  if (requests.length === 0) {
    return [];
  }

  return prisma.$transaction(async (tx) => {
    const team = await tx.team.findUnique({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundError("Team", teamId);
    }

    const itemIds = [...new Set(requests.map((request) => request.itemId))];
    const existingItems = await tx.item.findMany({
      where: { id: { in: itemIds } },
    });
    const existingItemIds = new Set(existingItems.map((item) => item.id));

    for (const itemId of itemIds) {
      if (!existingItemIds.has(itemId)) {
        throw new NotFoundError("Item", itemId);
      }
    }

    const quantityByItemId = new Map<string, number>();
    for (const request of requests) {
      const current = quantityByItemId.get(request.itemId) ?? 0;
      quantityByItemId.set(request.itemId, current + request.quantity);
    }

    for (const [itemId, quantity] of quantityByItemId) {
      const available = await getAvailableQuantity(itemId, tx);
      if (quantity > available) {
        throw new InsufficientStockError(itemId, quantity, available);
      }
    }

    const createdLoans: Loan[] = [];
    for (const request of requests) {
      const loan = await tx.loan.create({
        data: {
          teamId,
          itemId: request.itemId,
          quantity: request.quantity,
        },
      });
      createdLoans.push(loan);
    }

    return createdLoans;
  });
}

export async function returnLoans(
  teamId: string,
  itemIds: string[],
): Promise<Loan[]> {
  if (itemIds.length === 0) {
    return [];
  }

  return prisma.$transaction(async (tx) => {
    const team = await tx.team.findUnique({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundError("Team", teamId);
    }

    const uniqueItemIds = [...new Set(itemIds)];
    const activeLoans = await tx.loan.findMany({
      where: {
        teamId,
        itemId: { in: uniqueItemIds },
        returnedAt: null,
      },
    });

    const activeItemIds = new Set(activeLoans.map((loan) => loan.itemId));
    for (const itemId of uniqueItemIds) {
      if (!activeItemIds.has(itemId)) {
        throw new NotFoundError("Active loan", `${teamId}/${itemId}`);
      }
    }

    const returnedAt = new Date();
    const returnedLoans: Loan[] = [];

    for (const loan of activeLoans) {
      const returnedLoan = await tx.loan.update({
        where: { id: loan.id },
        data: { returnedAt },
      });
      returnedLoans.push(returnedLoan);
    }

    return returnedLoans;
  });
}

export type { Loan, LoanWithRelations };
