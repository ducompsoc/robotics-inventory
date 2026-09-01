import type { Contact, Prisma } from "@/generated/prisma/client";
import { NotFoundError } from "@/lib/inventory/errors";
import { contactSearchFilter, trimInput } from "@/lib/inventory/utils";
import { prisma } from "@/lib/prisma";

export async function getAllContacts(): Promise<Contact[]> {
  return prisma.contact.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getContactByEmail(email: string): Promise<Contact> {
  const normalizedEmail = trimInput(email);
  const contact = await prisma.contact.findUnique({
    where: { email: normalizedEmail },
  });

  if (!contact) {
    throw new NotFoundError("Contact", normalizedEmail);
  }

  return contact;
}

export async function findContacts(query: string): Promise<Contact[]> {
  return prisma.contact.findMany({
    where: contactSearchFilter(query),
    orderBy: { name: "asc" },
  });
}

export async function createContact(
  data: Prisma.ContactCreateInput,
): Promise<Contact> {
  const email =
    typeof data.email === "string" ? trimInput(data.email) : data.email;

  return prisma.contact.create({
    data: {
      ...data,
      email,
    },
  });
}

export async function updateContact(
  email: string,
  data: Prisma.ContactUpdateInput,
): Promise<Contact> {
  const normalizedEmail = trimInput(email);

  try {
    return await prisma.contact.update({
      where: { email: normalizedEmail },
      data,
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      throw new NotFoundError("Contact", normalizedEmail);
    }
    throw error;
  }
}

export async function deleteContact(email: string): Promise<void> {
  const normalizedEmail = trimInput(email);

  try {
    await prisma.contact.delete({ where: { email: normalizedEmail } });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      throw new NotFoundError("Contact", normalizedEmail);
    }
    throw error;
  }
}

export async function holdContact(email: string): Promise<Contact> {
  return updateContact(email, { idHeld: true });
}

export async function unholdContact(email: string): Promise<Contact> {
  return updateContact(email, { idHeld: false });
}

export async function toggleContactIdHeld(email: string): Promise<Contact> {
  const contact = await getContactByEmail(email);
  return contact.idHeld ? unholdContact(email) : holdContact(email);
}
