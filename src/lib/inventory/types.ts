import type { Item } from "@/generated/prisma/client";

export type ItemWithAvailable = Item & { available: number };

export enum LoanStatus {
  All = "all",
  Active = "active",
  Returned = "returned",
}

export type LoanFilter = {
  teamId?: string;
  itemId?: string;
  status?: LoanStatus;
};

export type LoanRequest = {
  itemId: string;
  quantity: number;
};
